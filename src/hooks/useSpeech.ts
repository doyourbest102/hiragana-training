import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeakOptions {
  /** 読み上げテキスト */
  text: string
  /** ユーザー操作由来かどうか（自動再生失敗時の判定用） */
  fromUserGesture?: boolean
}

interface UseSpeechResult {
  /** 音声が利用可能か */
  isSupported: boolean
  /** 再生中か */
  isSpeaking: boolean
  /** エラーメッセージ（なければ null） */
  error: string | null
  /** 読み上げを実行 */
  speak: (options: SpeakOptions) => Promise<boolean>
  /** 読み上げを停止 */
  stop: () => void
  /** エラーをクリア */
  clearError: () => void
}

const VOICE_WAIT_MS = 800
const START_TIMEOUT_MS = 2500
const PLAYBACK_TIMEOUT_MS = 10000
const CANCEL_GAP_MS = 60

/**
 * Web Speech API (SpeechSynthesis) を扱うカスタムフック。
 * Android Chrome ではユーザー操作後の再生が安定しやすい。
 */
export function useSpeech(): UseSpeechResult {
  const [isSupported, setIsSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  )
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const requestIdRef = useRef(0)
  const activeCleanupRef = useRef<(() => void) | null>(null)
  const voiceWaitCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false)
      return
    }

    const synth = window.speechSynthesis
    const updateVoices = () => {
      voicesRef.current = synth.getVoices()
    }

    setIsSupported(true)
    updateVoices()
    synth.addEventListener('voiceschanged', updateVoices)

    return () => {
      requestIdRef.current += 1
      activeCleanupRef.current?.()
      activeCleanupRef.current = null
      voiceWaitCleanupRef.current?.()
      voiceWaitCleanupRef.current = null
      synth.removeEventListener('voiceschanged', updateVoices)
      synth.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      requestIdRef.current += 1
      activeCleanupRef.current?.()
      activeCleanupRef.current = null
      voiceWaitCleanupRef.current?.()
      voiceWaitCleanupRef.current = null
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const waitForVoices = useCallback(
    (synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> => {
      const current = synth.getVoices()
      if (current.length > 0) {
        voicesRef.current = current
        return Promise.resolve(current)
      }

      voiceWaitCleanupRef.current?.()

      return new Promise((resolve) => {
        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          window.clearTimeout(timeoutId)
          synth.removeEventListener('voiceschanged', handleVoicesChanged)
          const voices = synth.getVoices()
          voicesRef.current = voices
          voiceWaitCleanupRef.current = null
          resolve(voices)
        }
        const handleVoicesChanged = () => {
          if (synth.getVoices().length > 0) finish()
        }
        const timeoutId = window.setTimeout(finish, VOICE_WAIT_MS)

        voiceWaitCleanupRef.current = finish
        synth.addEventListener('voiceschanged', handleVoicesChanged)
        handleVoicesChanged()
      })
    },
    [],
  )

  const speak = useCallback(
    async ({ text, fromUserGesture = false }: SpeakOptions): Promise<boolean> => {
      if (!('speechSynthesis' in window)) {
        setError('이 브라우저에서는 음성 재생을 지원하지 않습니다.')
        return false
      }

      const synth = window.speechSynthesis
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      setError(null)

      // 手動操作ではユーザージェスチャーを保つため、音声一覧を待たずに進める
      if (!fromUserGesture) {
        await waitForVoices(synth)
        if (requestIdRef.current !== requestId) return false
      }

      const shouldCancel =
        activeCleanupRef.current !== null || synth.speaking || synth.pending
      activeCleanupRef.current?.()
      activeCleanupRef.current = null

      if (shouldCancel) {
        synth.cancel()
        // Android Chromeではcancel直後のspeakが失敗するため短い間隔を空ける
        await new Promise((resolve) => window.setTimeout(resolve, CANCEL_GAP_MS))
        if (requestIdRef.current !== requestId) return false
      }

      if (synth.paused) synth.resume()

      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.rate = 0.75
        utterance.pitch = 1

        // speak()より前に日本語音声を選択する。未読込ならlang指定へフォールバック
        const voices =
          voicesRef.current.length > 0 ? voicesRef.current : synth.getVoices()
        const jaVoice =
          voices.find((voice) => voice.lang === 'ja-JP') ||
          voices.find((voice) => voice.lang.startsWith('ja'))
        if (jaVoice) utterance.voice = jaVoice

        return await new Promise<boolean>((resolve) => {
          let resultSettled = false
          let finished = false

          const settleResult = (ok: boolean) => {
            if (resultSettled) return
            resultSettled = true
            resolve(ok)
          }
          const cleanup = () => {
            window.clearTimeout(startTimeoutId)
            window.clearTimeout(playbackTimeoutId)
            utterance.onstart = null
            utterance.onend = null
            utterance.onerror = null
          }
          const finish = (ok: boolean, showError = false) => {
            if (finished) return
            finished = true
            cleanup()
            if (requestIdRef.current === requestId) {
              setIsSpeaking(false)
              if (showError && fromUserGesture) {
                setError(
                  '음성 재생에 실패했습니다. "소리 듣기" 버튼을 다시 눌러 주세요.',
                )
              }
              activeCleanupRef.current = null
            }
            settleResult(ok)
          }

          utterance.onstart = () => {
            if (requestIdRef.current !== requestId) return
            window.clearTimeout(startTimeoutId)
            setIsSpeaking(true)
            setError(null)
            settleResult(true)
          }
          utterance.onend = () => finish(true)
          utterance.onerror = () => finish(false, true)

          const startTimeoutId = window.setTimeout(() => {
            if (requestIdRef.current !== requestId) return
            if (synth.speaking) {
              setIsSpeaking(true)
              settleResult(true)
            } else {
              finish(false, true)
            }
          }, START_TIMEOUT_MS)
          const playbackTimeoutId = window.setTimeout(() => {
            if (requestIdRef.current !== requestId) return
            synth.cancel()
            finish(false, true)
          }, PLAYBACK_TIMEOUT_MS)

          activeCleanupRef.current = () => {
            cleanup()
            settleResult(false)
          }

          // 手動の初回再生はawaitを挟まず、クリック処理内で直接実行される
          synth.speak(utterance)
        })
      } catch {
        setIsSpeaking(false)
        if (fromUserGesture) setError('음성 재생에 실패했습니다.')
        return false
      }
    },
    [waitForVoices],
  )

  const clearError = useCallback(() => setError(null), [])

  return { isSupported, isSpeaking, error, speak, stop, clearError }
}
