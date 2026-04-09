function Scoreboard({ level, round, totalRounds, score, streak }) {
  const stats = [
    { label: "Level",  value: `${level}-Back` },
    { label: "Round",  value: `${round}/${totalRounds}` },
    { label: "Score",  value: `${score}%` },
    { label: "Streak", value: streak },
  ]

  return (
    <div style={{
      display: "flex",
      width: "100%",
      background: "var(--surface)",
      borderRadius: 10,
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {stats.map(({ label, value }, i) => (
        <div key={label} style={{
          flex: 1,
          textAlign: "center",
          padding: "10px 6px",
          borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.6px" }}>
            {label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--primary-dark)" }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Scoreboard
