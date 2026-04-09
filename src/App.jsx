import { useState, useEffect, useRef } from "react"
import Grid from "./components/Grid"
import Controls from "./components/Controls"
import Scoreboard from "./components/Scoreboard"
import HistoryTrail from "./components/HistoryTrail"
import ProgressChart from "./components/ProgressChart"

const TOTAL_ROUNDS = 20
const INTERVAL_MS = 2500
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function randomChar() { return CHARS[Math.floor(Math.random() * CHARS.length)] }
function randomCell() { return Math.floor(Math.random() * 9) }

function loadHistory() {
  try { return JSON.parse(localStorage.getItem("nback-history") || "[]") } catch { return [] }
}

function App() {
  // Restore last level from history, default 1
  const [level, setLevel] = useState(() => {
    const h = loadHistory()
    return h.length ? (h[h.length - 1].nextLevel ?? 1) : 1
  })

  // phase: "tutorial" | "playing" | "results" | "history"
  const [phase, setPhase]       = useState("tutorial")
  const [sequence, setSequence] = useState([])
  const [round, setRound]       = useState(0)
  const [activeCell, setActiveCell] = useState(null)
  const [activeChar, setActiveChar] = useState("")
  const [score, setScore]       = useState(0)
  const [streak, setStreak]     = useState(0)
  const [playing, setPlaying]   = useState(false)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState("") // "" | "correct" | "wrong"
  const [canAnswer, setCanAnswer] = useState(false)
  const [lastResult, setLastResult] = useState(null) // { score, level, levelChange }

  // Refs to avoid stale closures in intervals/effects
  const intervalRef = useRef(null)
  const correctRef  = useRef(0)  // authoritative correct count
  const roundRef    = useRef(0)  // authoritative round count
  const levelRef    = useRef(level)
  const savedRef    = useRef(false) // guard against double-save in StrictMode

  useEffect(() => { levelRef.current = level }, [level])

  function startGame() {
    setSequence([])
    setRound(0);      roundRef.current = 0
    setScore(0)
    setStreak(0)
    correctRef.current = 0
    setFeedback("")
    setCanAnswer(false)
    setAnswered(false)
    setActiveCell(null)
    setActiveChar("")
    savedRef.current = false
    setPhase("playing")
    setPlaying(true)
  }

  // ── Game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return

    intervalRef.current = setInterval(() => {
      setFeedback("")
      setAnswered(false)
      setCanAnswer(false)

      setRound(prev => {
        // End of session
        if (prev >= TOTAL_ROUNDS) {
          clearInterval(intervalRef.current)
          setPlaying(false)
          setActiveCell(null)
          setActiveChar("")
          setPhase("results")
          return prev
        }

        const newItem = { cell: randomCell(), char: randomChar() }
        const next = prev + 1
        roundRef.current = next

        setSequence(seq => {
          const updated = [...seq, newItem]
          setActiveCell(newItem.cell)
          setActiveChar(newItem.char)
          // Unlock answer buttons after a brief display delay
          if (updated.length > levelRef.current) {
            setTimeout(() => setCanAnswer(true), 400)
          }
          return updated
        })

        return next
      })
    }, INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [playing]) // intentionally no `level` dep — levelRef.current is used inside

  // ── Save session when results phase starts ───────────────────────────────
  useEffect(() => {
    if (phase !== "results" || savedRef.current) return
    savedRef.current = true

    const finalScore = Math.round((correctRef.current / TOTAL_ROUNDS) * 100)
    const lvl = levelRef.current

    let newLevel = lvl
    let change = 0
    if (finalScore >= 80) { newLevel = Math.min(lvl + 1, 5); change = 1 }
    else if (finalScore < 50) { newLevel = Math.max(lvl - 1, 1); change = lvl > 1 ? -1 : 0 }

    const history = loadHistory()
    history.push({ date: new Date().toLocaleDateString(), level: lvl, score: finalScore, nextLevel: newLevel })
    localStorage.setItem("nback-history", JSON.stringify(history))

    setScore(finalScore)
    setLevel(newLevel)
    setLastResult({ score: finalScore, level: lvl, levelChange: change })
  }, [phase])

  // ── Answer handler ───────────────────────────────────────────────────────
  function handleAnswer(type) {
    if (answered || !canAnswer) return
    const current = sequence[sequence.length - 1]
    const target  = sequence[sequence.length - 1 - levelRef.current]
    if (!current || !target) return

    const posMatch  = current.cell === target.cell
    const charMatch = current.char === target.char

    let isCorrect = false
    if (type === "position") isCorrect = posMatch  && !charMatch
    if (type === "letter")   isCorrect = charMatch && !posMatch
    if (type === "both")     isCorrect = posMatch  && charMatch
    if (type === "none")     isCorrect = !posMatch && !charMatch

    setAnswered(true)
    setCanAnswer(false)

    if (isCorrect) {
      correctRef.current += 1
      setScore(Math.round((correctRef.current / roundRef.current) * 100))
      setStreak(s => s + 1)
      setFeedback("correct")
    } else {
      setStreak(0)
      setFeedback("wrong")
    }
  }

  // ── Shared styles ────────────────────────────────────────────────────────
  const hasHistory = loadHistory().length > 0

  const card = {
    background: "var(--surface)",
    borderRadius: 14,
    border: "1px solid var(--border)",
    padding: "20px",
    boxShadow: "var(--shadow)",
  }
  const btnPrimary = {
    padding: "11px 28px", fontSize: "15px",
    borderRadius: 8, border: "1px solid var(--primary)",
    background: "var(--primary)", color: "#fff",
    cursor: "pointer", fontWeight: 500,
  }
  const btnSecondary = {
    padding: "11px 28px", fontSize: "15px",
    borderRadius: 8, border: "1px solid var(--border)",
    background: "var(--surface)", color: "var(--text-2)",
    cursor: "pointer",
  }
  const btnGhost = {
    padding: "6px 14px", fontSize: "13px",
    borderRadius: 6, border: "1px solid var(--border)",
    background: "transparent", color: "var(--text-3)",
    cursor: "pointer",
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--primary-dark)", letterSpacing: "-0.3px" }}>
          N-Back Trainer
        </h1>
        {phase !== "playing" && (
          <button style={btnGhost} onClick={() => setPhase(phase === "history" ? "tutorial" : "history")}>
            {phase === "history" ? "← Back" : hasHistory ? "History" : ""}
          </button>
        )}
      </header>

      {/* ── TUTORIAL ─────────────────────────────────────────────────────── */}
      {phase === "tutorial" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "slide-up 0.3s ease" }}>
          <div style={card}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--primary-dark)" }}>How to play</p>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 12 }}>
              Every 2.5 s a character flashes in one of 9 cells. Decide whether the <strong>position</strong> or
              {" "}<strong>letter</strong> matches what appeared <strong>{level} step{level > 1 ? "s" : ""} ago</strong>.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                ["Position match", "Same cell, different character"],
                ["Letter match",   "Same character, different cell"],
                ["Both match",     "Same cell AND same character"],
                ["No match",       "Nothing matches — skip or press no match"],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "baseline" }}>
                  <span style={{ background: "var(--primary-light)", color: "var(--primary)", borderRadius: 4, padding: "1px 7px", fontWeight: 500, whiteSpace: "nowrap", fontSize: 12, flexShrink: 0 }}>
                    {label}
                  </span>
                  <span style={{ color: "var(--text-3)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, background: "var(--primary-light)", border: "1px solid var(--border)" }}>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--primary-dark)" }}>
              Example ({level}-Back)
            </p>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
              Round 1: <strong>A</strong> in top-left &nbsp;·&nbsp; Round 2: <strong>A</strong> in bottom-right<br />
              → Same letter, different position → press <strong>Letter match</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...btnPrimary, flex: 1 }} onClick={startGame}>
              Start {level}-Back session
            </button>
            {hasHistory && (
              <button style={btnSecondary} onClick={() => setPhase("history")}>History</button>
            )}
          </div>
        </div>
      )}

      {/* ── PLAYING ──────────────────────────────────────────────────────── */}
      {phase === "playing" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Scoreboard level={level} round={round} totalRounds={TOTAL_ROUNDS} score={score} streak={streak} />

          {/* Countdown bar */}
          <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
            <div
              key={`cd-${round}`}
              style={{
                height: "100%",
                background: "var(--primary)",
                borderRadius: 2,
                transformOrigin: "left",
                animation: `countdown-shrink ${INTERVAL_MS}ms linear forwards`,
              }}
            />
          </div>

          <Grid activeCell={activeCell} activeChar={activeChar} feedback={feedback} />

          <HistoryTrail sequence={sequence} level={level} />

          <p style={{
            fontSize: 13,
            color: canAnswer ? "var(--primary)" : "var(--text-3)",
            fontWeight: canAnswer ? 500 : 400,
            transition: "color 0.25s",
            textAlign: "center",
            minHeight: "1.5em",
          }}>
            {sequence.length <= level
              ? `Memorizing… buttons unlock from round ${level + 1}`
              : canAnswer
              ? `Does anything match what appeared ${level} step${level > 1 ? "s" : ""} ago?`
              : "Wait for the next item…"}
          </p>

          <Controls
            onPosition={() => handleAnswer("position")}
            onLetter={()   => handleAnswer("letter")}
            onBoth={()     => handleAnswer("both")}
            onNone={()     => handleAnswer("none")}
            disabled={!canAnswer}
          />

          {feedback && (
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: feedback === "correct" ? "var(--success)" : "var(--error)",
              background: feedback === "correct" ? "var(--success-bg)" : "var(--error-bg)",
              padding: "6px 20px",
              borderRadius: 8,
              animation: "pop 0.25s ease",
            }}>
              {feedback === "correct" ? "Correct!" : "Wrong — keep going"}
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      {phase === "results" && lastResult && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, animation: "slide-up 0.3s ease" }}>
          <div style={{ ...card, width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 4 }}>
              Session complete · {lastResult.level}-Back
            </p>
            <p style={{ fontSize: 52, fontWeight: 700, color: "var(--primary)", lineHeight: 1, marginBottom: 10 }}>
              {lastResult.score}%
            </p>
            <p style={{ fontSize: 14, color: "var(--text-2)" }}>
              {lastResult.score >= 80
                ? lastResult.levelChange > 0
                  ? `Great work! Moving up to ${level}-Back next session.`
                  : `Excellent — you're at the maximum level!`
                : lastResult.score < 50
                ? lastResult.levelChange < 0
                  ? `Dropping to ${level}-Back to rebuild accuracy.`
                  : `Keep practicing — you'll get there.`
                : "Good effort — push above 80% to level up."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <button style={btnPrimary} onClick={startGame}>
              Play again ({level}-Back)
            </button>
            <button style={btnSecondary} onClick={() => setPhase("history")}>
              View history
            </button>
            <button style={{ ...btnGhost, alignSelf: "center" }} onClick={() => setPhase("tutorial")}>
              Back to start
            </button>
          </div>
        </div>
      )}

      {/* ── HISTORY ──────────────────────────────────────────────────────── */}
      {phase === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slide-up 0.3s ease" }}>
          <div style={card}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: "var(--primary-dark)" }}>
              Accuracy over time
            </p>
            <ProgressChart />
          </div>

          <div style={card}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--primary-dark)" }}>
              Recent sessions
            </p>
            <SessionList />
          </div>

          <button style={btnPrimary} onClick={startGame}>
            Start new session ({level}-Back)
          </button>
        </div>
      )}
    </div>
  )
}

// ── Session list (reads localStorage directly) ─────────────────────────────
function SessionList() {
  const history = loadHistory()
  if (history.length === 0) {
    return <p style={{ fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>No sessions yet.</p>
  }

  const recent = [...history].reverse().slice(0, 15)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {recent.map((s, i) => {
        const passed = s.score >= 80
        return (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 10px",
            borderRadius: 8,
            background: "var(--bg)",
            fontSize: 13,
          }}>
            <span style={{ color: "var(--text-3)" }}>{s.date}</span>
            <span style={{ color: "var(--text-2)" }}>{s.level}-Back</span>
            <span style={{
              fontWeight: 600,
              color: passed ? "var(--success)" : s.score < 50 ? "var(--error)" : "var(--text-2)",
            }}>
              {s.score}%
            </span>
            <span style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
              background: passed ? "var(--success-bg)" : s.score < 50 ? "var(--error-bg)" : "var(--primary-light)",
              color: passed ? "var(--success)" : s.score < 50 ? "var(--error)" : "var(--primary)",
              fontWeight: 500,
            }}>
              {passed ? "Level up" : s.score < 50 ? "Drop" : "Hold"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default App
