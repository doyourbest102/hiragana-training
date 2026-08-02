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

      const { width, height } = canvas

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
      ctx.drawImage(ink, 0, 0)
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
      canvas.width = Math.floor(size * dpr)
      canvas.height = Math.floor(size * dpr)

      const ink = getInkCanvas()
      ink.width = canvas.width
      ink.height = canvas.height

      const ctx = canvas.getContext('2d')
      const inkCtx = ink.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (inkCtx) {
        inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        inkCtx.lineCap = 'round'
        inkCtx.lineJoin = 'round'
        inkCtx.strokeStyle = '#0f766e'
        inkCtx.lineWidth = 8
      }

      // リサイズ時は手書きをクリア
      strokeCountRef.current = 0
      hasInkRef.current = false
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
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const canvas = canvasRef.current
      const ink = getInkCanvas()
      const inkCtx = ink.getContext('2d')
      if (!canvas || !inkCtx) return

      canvas.setPointerCapture(e.pointerId)
      drawingRef.current = true
      const { x, y } = getPoint(e)
      inkCtx.beginPath()
      inkCtx.moveTo(x, y)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return
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
      redraw()
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return
      drawingRef.current = false
      strokeCountRef.current += 1
      onStrokeEnd?.()
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }

    return (
      <div className="mx-auto w-full max-w-[360px]">
        <canvas
          ref={canvasRef}
          className="canvas-touch w-full rounded-2xl border-2 border-teal-200 bg-white shadow-sm"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label={`${guideChar} を書くキャンバス`}
          role="img"
        />
      </div>
    )
  },
)
