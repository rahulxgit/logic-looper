function UniversalPuzzle({ puzzleData, userInput, setUserInput }) {
  if (!puzzleData) return null;

  return (
    <div className="space-y-4">

      {/* Puzzle Type */}
      <div className="text-sm text-gray-500 text-center">
        {puzzleData.type} • {puzzleData.difficulty}
      </div>

      {/* Question */}
      <div className="text-lg font-semibold text-center text-black">
        {puzzleData.question}
      </div>

      {/* Input */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter answer"
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
}

export default UniversalPuzzle;
