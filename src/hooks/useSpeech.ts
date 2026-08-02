import { useCallback, useEffect, useState } from 'react'

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

/**
 * Web Speech API (SpeechSynthesis) を扱うカスタムフック。
 * Android Chrome ではユーザー操作後の再生が安定しやすい。
 */
export function useSpeech(): UseSpeechResult {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(
    async ({ text }: SpeakOptions): Promise<boolean> => {
      if (!('speechSynthesis' in window)) {
        setError('이 브라우저에서는 음성 재생을 지원하지 않습니다.')
        return false
      }

      return new Promise((resolve) => {
        try {
          // 連続再生時に前の発話を止める
          window.speechSynthesis.cancel()

          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = 'ja-JP'
          // 学習用に少し遅めの速度
          utterance.rate = 0.75
          utterance.pitch = 1

          // 日本語音声を優先して選択
          const voices = window.speechSynthesis.getVoices()
          const jaVoice =
            voices.find((v) => v.lang === 'ja-JP') ||
            voices.find((v) => v.lang.startsWith('ja'))
          if (jaVoice) {
            utterance.voice = jaVoice
          }

          utterance.onstart = () => {
            setIsSpeaking(true)
            setError(null)
          }
          utterance.onend = () => {
            setIsSpeaking(false)
            resolve(true)
          }
          utterance.onerror = () => {
            setIsSpeaking(false)
            setError('음성 재생에 실패했습니다. "소리 듣기" 버튼을 눌러 주세요.')
            resolve(false)
          }

          window.speechSynthesis.speak(utterance)

          // 一部環境で voices が遅延ロードされるため再取得を促す
          if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
              const updated = window.speechSynthesis.getVoices()
              const voice =
                updated.find((v) => v.lang === 'ja-JP') ||
                updated.find((v) => v.lang.startsWith('ja'))
              if (voice) {
                utterance.voice = voice
              }
            }
          }
        } catch {
          setError('음성 재생에 실패했습니다.')
          resolve(false)
        }
      })
    },
    [],
  )

  const clearError = useCallback(() => setError(null), [])

  return { isSupported, isSpeaking, error, speak, stop, clearError }
}
