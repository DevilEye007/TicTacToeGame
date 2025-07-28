import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Contact from "./Contact";

const App = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameMode, setGameMode] = useState(null); // 'friend' or 'bot'
  const [playCount, setPlayCount] = useState(() => parseInt(localStorage.getItem("playCount")) || 0);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const checkWinner = (updatedBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (updatedBoard[a] && updatedBoard[a] === updatedBoard[b] && updatedBoard[a] === updatedBoard[c]) {
        return updatedBoard[a];
      }
    }
    if (!updatedBoard.includes(null)) return "Draw";
    return null;
  };

  const botMove = (updatedBoard) => {
    const emptyIndices = updatedBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    if (randomIndex !== undefined) {
      updatedBoard[randomIndex] = "O";
    }
    return updatedBoard;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    let updatedBoard = [...board];
    updatedBoard[index] = "X";
    const firstCheck = checkWinner(updatedBoard);

    if (gameMode === "bot" && !firstCheck) {
      updatedBoard = botMove(updatedBoard);
    }

    setBoard(updatedBoard);
    const result = checkWinner(updatedBoard);
    if (result) {
      setWinner(result);
      const updatedPlayCount = playCount + 1;
      setPlayCount(updatedPlayCount);
      localStorage.setItem("playCount", updatedPlayCount);
    }
  };

  const handleFriendClick = (index) => {
    if (board[index] || winner) return;

    const updatedBoard = [...board];
    updatedBoard[index] = isXTurn ? "X" : "O";
    setBoard(updatedBoard);
    setIsXTurn(!isXTurn);

    const result = checkWinner(updatedBoard);
    if (result) {
      setWinner(result);
      const updatedPlayCount = playCount + 1;
      setPlayCount(updatedPlayCount);
      localStorage.setItem("playCount", updatedPlayCount);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXTurn(true);
    setWinner(null);
  };

  const renderBoard = () => (
    <div className="grid grid-cols-3 gap-4">
      {board.map((value, index) => (
        <button
          key={index}
          onClick={() => (gameMode === "bot" ? handleClick(index) : handleFriendClick(index))}
          className={`w-24 h-24 flex items-center justify-center rounded-lg text-3xl font-bold border-2 border-gray-700 transition-all duration-300 hover:scale-105 hover:border-teal-500 shadow-md ${
            value === "X"
              ? "text-blue-400"
              : value === "O"
              ? "text-pink-400"
              : "text-white"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-semibold text-white animate-bounce">
              Loading... <span className="text-pink-400">Let's Play</span>
            </h2>
          </motion.div>
        ) : gameMode === null ? (
          <motion.div
            key="mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-3xl font-bold text-teal-400 mb-4">Choose Mode</h1>
            <button
              onClick={() => setGameMode("friend")}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all duration-300"
            >
              Play with Friend
            </button>
            <button
              onClick={() => setGameMode("bot")}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition-all duration-300"
            >
              Play with Bot
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full"
          >
            <h1 className="text-4xl font-bold mb-2 text-teal-400 animate-pulse">Tic Tac Toe</h1>

            <motion.p
              className="text-sm text-gray-400 italic mb-2 text-center max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              You don’t grow when you’re comfortable. Get up and do the hard things.
            </motion.p>
            <motion.p
              className="text-xs text-gray-500 text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Developed by <span className="text-teal-400 font-medium">Faizan Sultan</span>
            </motion.p>

            {renderBoard()}

            {winner && (
              <>
                {winner !== "Draw" && <Confetti />}
                <div className="mt-6 text-2xl font-semibold text-green-400 animate-bounce">
                  {winner === "Draw" ? "It's a draw!" : `${winner} wins! 🎉`}
                </div>
              </>
            )}

            <button
              onClick={resetGame}
              className="mt-6 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/30"
            >
              Restart Game
            </button>

            <div className="mt-4 text-gray-400 text-sm">
              Total Wins Recorded:{" "}
              <span className="text-teal-300 font-semibold">{playCount}</span>
            </div>

            <Contact />
            <footer className="mt-10 text-center text-sm text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <p>
                  Made with 💙 using{" "}
                  <span className="text-cyan-400 font-medium">ReactJS</span> &{" "}
                  <span className="text-pink-400 font-medium">TailwindCSS</span>
                </p>
                <p>
                  &copy; {new Date().getFullYear()}{" "}
                  <span className="text-white font-semibold">Faizan's Games</span>. All rights reserved.
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
