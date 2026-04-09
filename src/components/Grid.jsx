function Grid({ activeCell, activeChar, feedback }) {
  const activeBg     = feedback === "correct" ? "var(--success-bg)"
                     : feedback === "wrong"   ? "var(--error-bg)"
                     : "var(--primary-light)"
  const activeBorder = feedback === "correct" ? "var(--success)"
                     : feedback === "wrong"   ? "var(--error)"
                     : "var(--primary)"
  const activeColor  = feedback === "correct" ? "var(--success)"
                     : feedback === "wrong"   ? "var(--error)"
                     : "var(--primary-dark)"

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 90px)",
      gap: 8,
      padding: 12,
      background: "var(--bg)",
      borderRadius: 12,
      border: "1px solid var(--border)",
    }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{
          width: 90,
          height: 90,
          borderRadius: 8,
          border: activeCell === i ? `2px solid ${activeBorder}` : "1px solid var(--border)",
          background: activeCell === i ? activeBg : "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 600,
          color: activeCell === i ? activeColor : "transparent",
          transition: "background 0.15s, border-color 0.15s",
          userSelect: "none",
        }}>
          {activeCell === i ? activeChar : ""}
        </div>
      ))}
    </div>
  )
}

export default Grid
