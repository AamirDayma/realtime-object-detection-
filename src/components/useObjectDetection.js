import { useEffect, useRef, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

const COLORS = [
  '#4f6fff', '#00e5c0', '#ff4f7b', '#ffd166', '#06d6a0',
  '#ef476f', '#118ab2', '#f4a261', '#e76f51', '#a8dadc',
]

const colorMap = {}
const getColor = (label) => {
  if (!colorMap[label]) {
    const idx = Object.keys(colorMap).length % COLORS.length
    colorMap[label] = COLORS[idx]
  }
  return colorMap[label]
}

export default function useObjectDetection() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const modelRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const fpsRef = useRef(0)

  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [detections, setDetections] = useState([])
  const [fps, setFps] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const drawDetections = useCallback((predictions, ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)

    predictions.forEach(pred => {
      const [x, y, width, height] = pred.bbox
      const color = getColor(pred.class)
      const score = Math.round(pred.score * 100)

      // Bounding box
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.strokeRect(x, y, width, height)
      ctx.shadowBlur = 0

      // Corner accents
      const cs = 12
      ctx.lineWidth = 3
      ctx.strokeStyle = color
      ;[
        [x, y, cs, 0, 0, cs],
        [x + width, y, -cs, 0, 0, cs],
        [x, y + height, cs, 0, 0, -cs],
        [x + width, y + height, -cs, 0, 0, -cs],
      ].forEach(([px, py, dx1, dy1, dx2, dy2]) => {
        ctx.beginPath()
        ctx.moveTo(px + dx1, py + dy1)
        ctx.lineTo(px, py)
        ctx.lineTo(px + dx2, py + dy2)
        ctx.stroke()
      })

      // Label background
      const label = `${pred.class} ${score}%`
      ctx.font = '600 12px Syne, sans-serif'
      const textW = ctx.measureText(label).width
      const labelH = 22
      const lx = x
      const ly = y > labelH ? y - labelH : y + height

      ctx.fillStyle = color + 'cc'
      ctx.beginPath()
      ctx.roundRect(lx, ly, textW + 16, labelH, 4)
      ctx.fill()

      // Label text
      ctx.fillStyle = '#fff'
      ctx.fillText(label, lx + 8, ly + 15)
    })
  }, [])

  const detect = useCallback(async (now) => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (video.readyState === 4) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const predictions = await modelRef.current.detect(video)
      drawDetections(predictions, ctx, canvas.width, canvas.height)
      setDetections(predictions.map(p => ({
        label: p.class,
        score: Math.round(p.score * 100),
        color: getColor(p.class),
      })))

      // FPS calculation
      if (lastTimeRef.current) {
        const delta = now - lastTimeRef.current
        fpsRef.current = Math.round(1000 / delta)
        setFps(fpsRef.current)
      }
      lastTimeRef.current = now
    }

    animFrameRef.current = requestAnimationFrame(detect)
  }, [drawDetections])

  const startCamera = useCallback(async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      // Load TF model
      await tf.ready()
      modelRef.current = await cocoSsd.load({ base: 'mobilenet_v2' })

      // Get webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      videoRef.current.srcObject = stream
      await new Promise(resolve => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          resolve()
        }
      })

      setStatus('ready')
      setIsRunning(true)
      animFrameRef.current = requestAnimationFrame(detect)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Camera or model failed to load.')
    }
  }, [detect])

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
    setIsRunning(false)
    setDetections([])
    setFps(0)
    setStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  return {
    videoRef, canvasRef,
    status, detections, fps, isRunning, errorMsg,
    startCamera, stopCamera,
  }
}
