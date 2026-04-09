function Controls({ onPosition, onLetter, onBoth, onNone, disabled }) {
  const base = {
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontWeight: 500,
    transition: "opacity 0.2s",
  }
  const primary = {
    ...base,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  }
  const none = {
    ...base,
    background: "transparent",
    border: "1px dashed var(--border)",
    color: "var(--text-3)",
    fontSize: "13px",
    padding: "8px 24px",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <button style={primary} onClick={onPosition} disabled={disabled}>Position match</button>
        <button style={primary} onClick={onLetter}   disabled={disabled}>Letter match</button>
        <button style={primary} onClick={onBoth}     disabled={disabled}>Both match</button>
      </div>
      <button style={none} onClick={onNone} disabled={disabled}>No match</button>
    </div>
  )
}

export default Controls
