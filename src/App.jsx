import React from 'react'
import useObjectDetection from './components/useObjectDetection'
import DetectionPanel from './components/DetectionPanel'

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scanline {
    0% { top: 0%; }
    100% { top: 100%; }
  }
  .scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(79,111,255,0.6), transparent);
    animation: scanline 2.5s linear infinite;
    pointer-events: none;
    z-index: 5;
  }
  .btn-start {
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 14px 36px;
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 800;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
    box-shadow: 0 0 24px rgba(79,111,255,0.3);
  }
  .btn-start:hover {
    background: #3a58f5;
    box-shadow: 0 0 36px rgba(79,111,255,0.5);
    transform: translateY(-1px);
  }
  .btn-stop {
    background: transparent;
    color: var(--accent3);
    border: 1.5px solid var(--accent3);
    padding: 10px 28px;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-stop:hover {
    background: rgba(255,79,123,0.1);
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 90px;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .stat-value {
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 700;
    color: var(--accent2);
  }
`

export default function App() {
  const {
    videoRef, canvasRef,
    status, detections, fps, isRunning, errorMsg,
    startCamera, stopCamera,
  } = useObjectDetection()

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', animation: 'fadeIn 0.5s ease' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isRunning ? 'var(--accent2)' : 'var(--text-dim)', boxShadow: isRunning ? '0 0 8px var(--accent2)' : 'none', transition: 'all 0.3s' }} />
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text)' }}>
                OBJECT DETECTOR
              </h1>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '18px' }}>
              TensorFlow.js · COCO-SSD · 80 classes
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="stat-card">
              <span className="stat-label">FPS</span>
              <span className="stat-value">{isRunning ? fps : '—'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Objects</span>
              <span className="stat-value" style={{ color: 'var(--accent)' }}>{detections.length}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div style={{ display: 'flex', gap: '16px', flex: 1, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Camera view */}
          <div style={{ flex: '1 1 560px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'var(--surface)',
              border: `1.5px solid ${isRunning ? 'var(--border-bright)' : 'var(--border)'}`,
              transition: 'border-color 0.4s',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Scan line when running */}
              {isRunning && <div className="scan-line" />}

              {/* Video */}
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  display: 'block',
                  transform: 'scaleX(-1)',
                  opacity: isRunning ? 1 : 0,
                  transition: 'opacity 0.4s',
                }}
                muted
                playsInline
              />

              {/* Canvas overlay */}
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  transform: 'scaleX(-1)',
                  pointerEvents: 'none',
                }}
              />

              {/* Idle / loading state */}
              {!isRunning && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px' }}>
                  {status === 'loading' ? (
                    <>
                      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>Loading AI model...</p>
                    </>
                  ) : status === 'error' ? (
                    <>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent3)', textAlign: 'center' }}>⚠ {errorMsg}</p>
                      <button className="btn-start" onClick={startCamera}>Retry</button>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      </div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Camera feed will appear here</p>
                      <button className="btn-start" onClick={startCamera}>START DETECTION</button>
                    </>
                  )}
                </div>
              )}

              {/* Status badge */}
              {isRunning && (
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(6,7,13,0.8)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent2)', boxShadow: '0 0 6px var(--accent2)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent2)', letterSpacing: '1px' }}>LIVE</span>
                </div>
              )}
            </div>

            {/* Controls */}
            {isRunning && (
              <div style={{ display: 'flex', justifyContent: 'center', animation: 'fadeIn 0.3s ease' }}>
                <button className="btn-stop" onClick={stopCamera}>■ STOP</button>
              </div>
            )}
          </div>

          {/* Detection sidebar */}
          <div style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <DetectionPanel detections={detections} />

            {/* Info card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Model Info</p>
              {[['Model', 'COCO-SSD'], ['Backend', 'MobileNet v2'], ['Classes', '80 objects'], ['Runs on', 'Browser (CPU/GPU)']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{k}</span>
                  <span style={{ color: 'var(--text)', fontWeight: '600' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', padding: '8px 0' }}>
          Built with React · TensorFlow.js · Deployed on GitHub Pages
        </footer>
      </div>
    </>
  )
}
