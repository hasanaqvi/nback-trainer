import { useState, useEffect, useRef } from "react"
import Grid from "./components/Grid"
import Controls from "./components/Controls"
import Scoreboard from "./components/Scoreboard"

const TOTAL_ROUNDS = 20
const INTERVAL_MS = 2000
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function randomCell() {
  return Math.floor(Math.random() * 9)
}

function App() {
  const [level, setLevel] = useState(1)
  const [sequence, setSequence] = useState([])
  const [round, setRound] = useState(0)
  const [activeCell, setActiveCell] = useState(null)
  const [activeChar, setActiveChar] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [sessionOver, setSessionOver] = useState(false)
  const intervalRef = useRef(null)

  function startGame() {
    setSequence([])
    setRound(0)
    setScore(0)
    setStreak(0)
    setCorrect(0)
    setSessionOver(false)
    setFeedback("")
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing) return

    intervalRef.current = setInterval(() => {
      setRound(prev => {
        if (prev >= TOTAL_ROUNDS) {
          clearInterval(intervalRef.current)
          setPlaying(false)
          setActiveCell(null)
          setActiveChar("")
          setSessionOver(true)
          return prev
        }

        const newItem = { cell: randomCell(), char: randomChar() }

        setSequence(seq => {
          const updated = [...seq, newItem]
          setActiveCell(newItem.cell)
          setActiveChar(newItem.char)
          setAnswered(false)
          setFeedback("")
          return updated
        })

        return prev + 1
      })
    }, INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [playing])

  function getCurrentAndTarget() {
    const current = sequence[sequence.length - 1]
    const target = sequence[sequence.length - 1 - level]
    return { current, target }
  }

  function handleAnswer(type) {
    if (answered || sequence.length <= level) return
    const { current, target } = getCurrentAndTarget()
    if (!current || !target) return

    const posMatch = current.cell === target.cell
    const charMatch = current.char === target.char
    const actuallyBoth = posMatch && charMatch

    let isCorrect = false
    if (type === "position") isCorrect = posMatch && !charMatch
    if (type === "letter") isCorrect = charMatch && !posMatch
    if (type === "both") isCorrect = actuallyBoth

    setAnswered(true)

    if (isCorrect) {
      setCorrect(c => {
        const newCorrect = c + 1
        setScore(Math.round((newCorrect / round) * 100))
        return newCorrect
      })
      setStreak(s => s + 1)
      setFeedback("correct")
    } else {
      setStreak(0)
      setFeedback("wrong")
    }
  }

  function saveAndFinish() {
    const history = JSON.parse(localStorage.getItem("nback-history") || "[]")
    history.push({
      date: new Date().toLocaleDateString(),
      level,
      score,
    })
    localStorage.setItem("nback-history", JSON.stringify(history))

    if (score >= 80) setLevel(l => Math.min(l + 1, 5))
    else if (score < 50) setLevel(l => Math.max(l - 1, 1))
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "32px",
      fontFamily: "sans-serif",
      padding: "24px",
    }}>
      <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "500" }}>
        N-Back Trainer
      </h1>

      {!playing && !sessionOver && (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#666", maxWidth: "320px", lineHeight: "1.6" }}>
            A letter or number will flash in one of 9 cells every 2 seconds.
            Remember both the position and character from {level} step{level > 1 ? "s" : ""} ago.
          </p>
          <button onClick={startGame} style={{
            padding: "12px 32px", fontSize: "16px",
            borderRadius: "8px", border: "1px solid #534AB7",
            background: "#EEEDFE", color: "#3C3489", cursor: "pointer",
          }}>
            Start {level}-Back session
          </button>
        </div>
      )}

      {playing && (
        <>
          <Scoreboard
            level={level}
            round={round}
            totalRounds={TOTAL_ROUNDS}
            score={score}
            streak={streak}
          />
          <Grid activeCell={activeCell} activeChar={activeChar} />
          <div style={{ fontSize: "13px", color: "#888" }}>
            Does this match what appeared {level} step{level > 1 ? "s" : ""} ago?
          </div>
          <Controls
            onPosition={() => handleAnswer("position")}
            onLetter={() => handleAnswer("letter")}
            onBoth={() => handleAnswer("both")}
            disabled={answered || sequence.length <= level}
          />
          {feedback && (
            <div style={{
              fontSize: "14px", fontWeight: "500",
              color: feedback === "correct" ? "#3B6D11" : "#A32D2D"
            }}>
              {feedback === "correct" ? "Correct!" : "Wrong"}
            </div>
          )}
        </>
      )}

      {sessionOver && (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ margin: 0 }}>Session complete</h2>
          <p style={{ color: "#666" }}>You scored {score}% on {level}-Back</p>
          <p style={{ fontSize: "13px", color: "#888" }}>
            {score >= 80 ? "Excellent! Level up next session." :
             score < 50 ? "Keep practicing — level stays the same." :
             "Good effort — level stays the same."}
          </p>
          <button onClick={() => { saveAndFinish(); startGame() }} style={{
            padding: "12px 32px", fontSize: "16px",
            borderRadius: "8px", border: "1px solid #534AB7",
            background: "#EEEDFE", color: "#3C3489", cursor: "pointer",
          }}>
            Play again
          </button>
          <button onClick={saveAndFinish} style={{
            padding: "12px 32px", fontSize: "16px",
            borderRadius: "8px", border: "1px solid #ccc",
            background: "#fff", cursor: "pointer",
          }}>
            Done for today
          </button>
        </div>
      )}
    </div>
  )
}

export default App