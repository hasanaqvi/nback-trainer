# N-Back Trainer

A Dual N-Back cognitive training app built with React and Vite. Train your working memory by tracking sequences of positions and letters across time.

## What is Dual N-Back?

Every 2.5 seconds, a character flashes in one of 9 cells on a grid. Your job is to identify whether the **position**, **letter**, or **both** match what appeared N steps ago. The default starting level is 1-Back (compare to 1 step ago). As your accuracy improves, the level increases automatically — up to 5-Back.

## Scoring & Level Progression

| Score | Result |
|-------|--------|
| ≥ 80% | Level up next session |
| 50–79% | Stay at current level |
| < 50% | Drop down one level |

Each session is 20 rounds. Your level and session history are saved locally in the browser.

## Answer Buttons

| Button | Correct when… |
|--------|---------------|
| **Position match** | The same cell is highlighted as N steps ago |
| **Letter match** | The same character appeared N steps ago |
| **Both match** | Both cell and character match N steps ago |
| **No match** | Neither matches — or just do nothing |

## Features

- Adaptive difficulty (1-Back through 5-Back)
- Countdown bar showing time remaining in each round
- History trail highlighting the N-back target item
- Session history and accuracy chart saved in `localStorage`
- Colour-coded feedback on the grid (green = correct, red = wrong)

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Tech Stack

- [React 19](https://react.dev)
- [Vite 8](https://vite.dev)
