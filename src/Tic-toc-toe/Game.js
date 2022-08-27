import * as React from "react";
import Board from "./Board";
import { useLocalStorage } from "../utils/useLocalStorage";

const initialValue = Array(9).fill(null);
function Game() {
  const [currentStep, setCurrentStep] = useLocalStorage("tic-tac-toe:step", 0);
  const [history, setHistory] = useLocalStorage("tic-tac-toe:history", [
    initialValue
  ]);

  const currentSquare = history[currentStep];
  const nextValue = calculateNextValue(currentSquare);
  const winner = calculateWinner(currentSquare);
  const status = calculateStatus();

  function calculateNextValue(currentSquare) {
    return currentSquare.filter(Boolean).length % 2 === 0 ? "X" : "O";
  }

  function selectSquare(square) {
    if (winner || currentSquare[square]) {
      return;
    }
    const newHistory = history.slice(0, currentStep + 1);
    const squaresCopy = [...currentSquare];
    squaresCopy[square] = nextValue;

    setHistory([...newHistory, squaresCopy]);
    setCurrentStep(newHistory.length);
  }

  function calculateStatus() {
    return winner ? `Winner is ${winner}` : null;
  }

  const moves = history.map((stepSquares, step) => {
    const des = step === 0 ? "Go to game Start" : `Go to Step #${step}`;
    const isCurrentStep = step === currentStep;
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {des} {isCurrentStep ? "(current)" : null}
        </button>
      </li>
    );
  });

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  function restart() {
    setHistory([initialValue]);
    setCurrentStep(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
