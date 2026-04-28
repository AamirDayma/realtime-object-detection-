import React from 'react'

const styles = {
  panel: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '200px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  heading: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '4px',
  },
  empty: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-dim)',
    textAlign: 'center',
    padding: '20px 0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    transition: 'border-color 0.2s',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  labelCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text)',
    textTransform: 'capitalize',
  },
  barWrap: {
    height: '3px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  score: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
}

export default function DetectionPanel({ detections }) {
  return (
    <div style={styles.panel}>
      <p style={styles.heading}>Detected Objects</p>
      {detections.length === 0 ? (
        <p style={styles.empty}>No objects detected</p>
      ) : (
        detections.map((d, i) => (
          <div key={i} style={{ ...styles.item, borderColor: d.color + '44' }}>
            <div style={{ ...styles.dot, background: d.color }} />
            <div style={styles.labelCol}>
              <span style={styles.label}>{d.label}</span>
              <div style={styles.barWrap}>
                <div style={{
                  height: '100%',
                  width: `${d.score}%`,
                  background: d.color,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
            <span style={styles.score}>{d.score}%</span>
          </div>
        ))
      )}
    </div>
  )
}
