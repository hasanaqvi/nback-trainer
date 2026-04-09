function MiniGrid({ cell }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 6px)", gap: "2px" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{
          width: 6,
          height: 6,
          borderRadius: 1,
          background: i === cell ? "var(--primary)" : "var(--border)",
        }} />
      ))}
    </div>
  )
}

function HistoryTrail({ sequence, level }) {
  if (sequence.length < 2) return null

  const count = Math.min(sequence.length, level + 3)
  const trail = sequence.slice(-count)
  const startIdx = sequence.length - count

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap" }}>
      {trail.map((item, i) => {
        const isNBack   = i === trail.length - 1 - level
        const isCurrent = i === trail.length - 1
        const opacity   = isCurrent || isNBack ? 1 : 0.3 + (i / trail.length) * 0.35

        return (
          <div key={startIdx + i} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "6px 8px",
            borderRadius: 8,
            background: isNBack   ? "var(--primary-light)"
                      : isCurrent ? "var(--surface)"
                      : "transparent",
            border: isNBack   ? "1px solid var(--primary)"
                  : isCurrent ? "1px solid var(--border)"
                  : "1px solid transparent",
            opacity,
            transition: "opacity 0.2s",
          }}>
            <MiniGrid cell={item.cell} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: isNBack ? "var(--primary)" : "var(--text-2)",
              lineHeight: 1,
            }}>
              {item.char}
            </span>
            {isNBack && (
              <span style={{ fontSize: 9, color: "var(--primary)", fontWeight: 600, lineHeight: 1 }}>
                −{level}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HistoryTrail
