import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react'

export interface WritingCanvasHandle {
  /** キャンバスをクリア（見本は残す） */
  clear: () => void
  /** 何か描かれているか */
  hasStrokes: () => boolean
  /**
   * 将来の手書き認識用に、描画ストロークデータを取得できる入口。
   * 初期版では線の本数など簡易情報のみ返す。
   */
  getStrokeData: () => { strokeCount: number }
}

interface WritingCanvasProps {
  /** 見本として薄く表示するひらがな */
  guideChar: string
  /** 線を描き終えたとき（1ストローク完了） */
  onStrokeEnd?: () => void
}

/**
 * 指・マウスでひらがなをなぞれるキャンバス。
 * 見本文字を薄く表示し、その上に手書き線を重ねる。
 * 将来の手書き認識に備え、描画データを分離しやすい構造にしている。
 */
export const WritingCanvas = forwardRef<WritingCanvasHandle, WritingCanvasProps>(
  function WritingCanvas({ guideChar, onStrokeEnd }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawingRef = useRef(false)
    const activePointerIdRef = useRef<number | null>(null)
    const strokeHasInkRef = useRef(false)
    const strokeCountRef = useRef(0)
    const hasInkRef = useRef(false)
    // 手書きレイヤーだけを保持するためのオフスクリーンキャンバス
    const inkCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const getInkCanvas = useCallback(() => {
      if (!inkCanvasRef.current) {
        inkCanvasRef.current = document.createElement('canvas')
      }
      return inkCanvasRef.current
    }, [])

    /** 表示用キャンバスに見本＋手書きを合成描画 */
    const redraw = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return
      const scaleX = canvas.width / width
      const scaleY = canvas.height / height

      ctx.save()
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)

      // 背景
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // 薄い見本文字
      ctx.fillStyle = 'rgba(13, 148, 136, 0.18)'
      ctx.font = `bold ${Math.floor(height * 0.72)}px "M PLUS Rounded 1c", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(guideChar, width / 2, height / 2 + height * 0.02)

      // 手書きレイヤーを重ねる
      const ink = getInkCanvas()
      ctx.drawImage(ink, 0, 0, ink.width, ink.height, 0, 0, width, height)
      ctx.restore()
    }, [guideChar, getInkCanvas])

    /** 高DPI対応でキャンバスサイズを合わせる */
    const setupSize = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return

      const size = Math.min(parent.clientWidth, 360)
      const dpr = window.devicePixelRatio || 1

      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      const cssWidth = canvas.clientWidth
      const cssHeight = canvas.clientHeight
      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr))
      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr))

      const ink = getInkCanvas()
      if (
        canvas.width === pixelWidth &&
        canvas.height === pixelHeight &&
        ink.width === pixelWidth &&
        ink.height === pixelHeight
      ) {
        redraw()
        return
      }

      // 画面回転などで実サイズが変わっても、書いた線は拡縮して保持する
      const previousInk = document.createElement('canvas')
      previousInk.width = ink.width
      previousInk.height = ink.height
      if (ink.width > 0 && ink.height > 0) {
        previousInk.getContext('2d')?.drawImage(ink, 0, 0)
      }

      canvas.width = pixelWidth
      canvas.height = pixelHeight
      ink.width = pixelWidth
      ink.height = pixelHeight

      const inkCtx = ink.getContext('2d')
      if (inkCtx) {
        const scaleX = pixelWidth / cssWidth
        const scaleY = pixelHeight / cssHeight
        inkCtx.setTransform(scaleX, 0, 0, scaleY, 0, 0)
        inkCtx.lineCap = 'round'
        inkCtx.lineJoin = 'round'
        inkCtx.strokeStyle = '#0f766e'
        inkCtx.lineWidth = 8
        if (previousInk.width > 0 && previousInk.height > 0) {
          inkCtx.save()
          inkCtx.setTransform(1, 0, 0, 1, 0, 0)
          inkCtx.drawImage(
            previousInk,
            0,
            0,
            previousInk.width,
            previousInk.height,
            0,
            0,
            pixelWidth,
            pixelHeight,
          )
          inkCtx.restore()
        }
      }

      drawingRef.current = false
      activePointerIdRef.current = null
      strokeHasInkRef.current = false
      redraw()
    }, [getInkCanvas, redraw])

    useEffect(() => {
      setupSize()
      const onResize = () => setupSize()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, [setupSize])

    // 見本文字が変わったら手書きもリセット
    useEffect(() => {
      const ink = getInkCanvas()
      const inkCtx = ink.getContext('2d')
      if (inkCtx) {
        inkCtx.save()
        inkCtx.setTransform(1, 0, 0, 1, 0, 0)
        inkCtx.clearRect(0, 0, ink.width, ink.height)
        inkCtx.restore()
      }
      strokeCountRef.current = 0
      hasInkRef.current = false
      redraw()
    }, [guideChar, getInkCanvas, redraw])

    useImperativeHandle(ref, () => ({
      clear: () => {
        drawingRef.current = false
        activePointerIdRef.current = null
        strokeHasInkRef.current = false
        const ink = getInkCanvas()
        const inkCtx = ink.getContext('2d')
        if (inkCtx) {
          inkCtx.save()
          inkCtx.setTransform(1, 0, 0, 1, 0, 0)
          inkCtx.clearRect(0, 0, ink.width, ink.height)
          inkCtx.restore()
        }
        hasInkRef.current = false
        redraw()
      },
      hasStrokes: () => hasInkRef.current,
      getStrokeData: () => ({ strokeCount: strokeCountRef.current }),
    }))

    const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left - canvas.clientLeft,
        y: e.clientY - rect.top - canvas.clientTop,
      }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        drawingRef.current ||
        !e.isPrimary ||
        (e.pointerType === 'mouse' && e.button !== 0)
      ) {
        return
      }
      e.preventDefault()
      const canvas = canvasRef.current
      const ink = getInkCanvas()
      const inkCtx = ink.getContext('2d')
      if (!canvas || !inkCtx) return

      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {
        // Pointer Capture非対応時もCanvas内の描画は続行する
      }
      drawingRef.current = true
      activePointerIdRef.current = e.pointerId
      strokeHasInkRef.current = false
      const { x, y } = getPoint(e)
      inkCtx.beginPath()
      inkCtx.moveTo(x, y)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        !drawingRef.current ||
        activePointerIdRef.current !== e.pointerId
      ) {
        return
      }
      e.preventDefault()
      const ink = getInkCanvas()
      const inkCtx = ink.getContext('2d')
      if (!inkCtx) return

      const { x, y } = getPoint(e)
      inkCtx.lineTo(x, y)
      inkCtx.stroke()
      inkCtx.beginPath()
      inkCtx.moveTo(x, y)
      hasInkRef.current = true
      strokeHasInkRef.current = true
      redraw()
    }

    const finishPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        !drawingRef.current ||
        activePointerIdRef.current !== e.pointerId
      ) {
        return
      }
      drawingRef.current = false
      activePointerIdRef.current = null
      if (strokeHasInkRef.current) {
        strokeCountRef.current += 1
        onStrokeEnd?.()
      }
      strokeHasInkRef.current = false
      try {
        const canvas = canvasRef.current
        if (canvas?.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId)
        }
      } catch {
        // ignore
      }
    }

    return (
      <div className="mx-auto w-full max-w-[360px]">
        <canvas
          ref={canvasRef}
          className="canvas-touch block w-full rounded-2xl border-2 border-teal-200 bg-white shadow-sm"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
          onLostPointerCapture={finishPointer}
          aria-label={`${guideChar} 쓰기 캔버스`}
          role="img"
        />
      </div>
    )
  },
)
