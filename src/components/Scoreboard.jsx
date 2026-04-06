function Scoreboard({ level, round, totalRounds, score, streak }) {
    const statStyle = {
      textAlign: "center",
      minWidth: "60px",
    }
    const labelStyle = {
      fontSize: "12px",
      color: "#888",
      marginBottom: "4px",
    }
    const valueStyle = {
      fontSize: "22px",
      fontWeight: "500",
    }
  
    return (
      <div style={{ display: "flex", gap: "32px", justifyContent: "center" }}>
        <div style={statStyle}>
          <div style={labelStyle}>Level</div>
          <div style={valueStyle}>{level}-Back</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>Round</div>
          <div style={valueStyle}>{round} / {totalRounds}</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>Score</div>
          <div style={valueStyle}>{score}%</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>Streak</div>
          <div style={valueStyle}>{streak}</div>
        </div>
      </div>
    )
  }
  
  export default Scoreboard