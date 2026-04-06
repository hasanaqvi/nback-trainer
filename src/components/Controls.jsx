function Controls({ onPosition, onLetter, onBoth, disabled }) {
    const btnStyle = {
      padding: "10px 24px",
      fontSize: "15px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: "#fff",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }
  
    return (
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button style={btnStyle} onClick={onPosition} disabled={disabled}>
          Position match
        </button>
        <button style={btnStyle} onClick={onLetter} disabled={disabled}>
          Letter match
        </button>
        <button style={btnStyle} onClick={onBoth} disabled={disabled}>
          Both match
        </button>
      </div>
    )
  }
  
  export default Controls