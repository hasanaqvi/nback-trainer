function ProgressChart() {
  const history = (() => {
    try { return JSON.parse(localStorage.getItem("nback-history") || "[]") } catch { return [] }
  })()

  if (history.length < 2) {
    return (
      <p style={{ fontSize: 13, color: "var(--text-3)", textAlign: "center", padding: "16px 0" }}>
        Complete at least 2 sessions to see your chart.
      </p>
    )
  }

  const sessions = history.slice(-20)
  const n = sessions.length
  const W = 400, H = 180
  const pad = { top: 16, right: 22, bottom: 28, left: 36 }
  const cW = W - pad.left - pad.right
  const cH = H - pad.top - pad.bottom

  const xPos = i => pad.left + (n === 1 ? cW / 2 : (i / (n - 1)) * cW)
  const yPos = v => pad.top + cH - (v / 100) * cH

  const linePts = sessions.map((s, i) => `${xPos(i)},${yPos(s.score)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(g => (
        <g key={g}>
          <line x1={pad.left} y1={yPos(g)} x2={W - pad.right} y2={yPos(g)}
            stroke="var(--border)" strokeWidth={g === 0 ? 1.5 : 1} />
          <text x={pad.left - 4} y={yPos(g) + 4} textAnchor="end" fontSize={9} fill="var(--text-3)">
            {g}
          </text>
        </g>
      ))}

      {/* 80% pass threshold */}
      <line x1={pad.left} y1={yPos(80)} x2={W - pad.right} y2={yPos(80)}
        stroke="var(--primary)" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
      <text x={W - pad.right + 2} y={yPos(80) + 4} fontSize={8} fill="var(--primary)" opacity={0.6}>
        80%
      </text>

      {/* Area fill */}
      {n > 1 && (
        <polygon
          points={`${xPos(0)},${yPos(0)} ${linePts} ${xPos(n - 1)},${yPos(0)}`}
          fill="var(--primary)" opacity={0.07}
        />
      )}

      {/* Line */}
      {n > 1 && (
        <polyline points={linePts} fill="none" stroke="var(--primary)" strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Dots */}
      {sessions.map((s, i) => (
        <circle key={i} cx={xPos(i)} cy={yPos(s.score)} r={4}
          fill="var(--primary)" stroke="white" strokeWidth={2} />
      ))}

      {/* X axis session numbers (sparse) */}
      {sessions.map((s, i) => {
        const step = Math.ceil(n / 5)
        if (n <= 8 || i === 0 || i === n - 1 || i % step === 0) {
          return (
            <text key={i} x={xPos(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--text-3)">
              {history.length - n + i + 1}
            </text>
          )
        }
        return null
      })}
    </svg>
  )
}

export default ProgressChart
