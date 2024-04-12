import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  function handleClick(i) {
    const historyPoint = squares.slice(0, i + 1);
    const nextSquares = squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setHistory([...history, {squares: nextSquares, move: i}]);
  }

  const {winner, winningLine} = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move #${move} (${step.move % 3}, ${Math.floor(step.move / 3)})` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, idx) => (
        <div className="board-row" key={idx}>
          {Array(3).fill(null).map((_, jdx) => {
            const index = idx * 3 + jdx;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                highlight={winningLine && winningLine.includes(index)}
              />
            );
          })}
        </div>
      ))}
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Descending' : 'Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return { winner: null, winningLine: null };
}

function jumpTo(step) {
  // Logic to reset the board to a particular move in the history
}
