function Grid({ activeCell, activeChar }) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 90px)",
        gap: "8px",
        padding: "12px",
        background: "var(--color-background-secondary, #f5f5f5)",
        borderRadius: "12px",
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            width: "90px",
            height: "90px",
            borderRadius: "8px",
            border: activeCell === i
              ? "2px solid #534AB7"
              : "1px solid #ddd",
            background: activeCell === i ? "#EEEDFE" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "500",
            color: activeCell === i ? "#3C3489" : "transparent",
            transition: "all 0.1s ease",
          }}>
            {activeCell === i ? activeChar : ""}
          </div>
        ))}
      </div>
    )
  }
  
  export default Grid