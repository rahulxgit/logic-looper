function UniversalPuzzle({ puzzleData, userInput, setUserInput }) {
  if (!puzzleData) return null;

  return (
    <div className="space-y-5 fade-in">

      {/* Puzzle Type + Difficulty */}
      <div className="text-sm text-gray-500 text-center">
        {puzzleData.type} • {puzzleData.difficulty}
      </div>

      {/* Question */}
      <div className="text-lg font-semibold text-center text-gray-900">
        {puzzleData.question}
      </div>

      {/* Input */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter answer..."
        className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

    </div>
  );
}

export default UniversalPuzzle;
