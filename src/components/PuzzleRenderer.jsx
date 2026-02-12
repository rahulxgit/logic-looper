function PuzzleRenderer({ puzzleType, puzzleData, userInput, setUserInput }) {
  if (puzzleData.sequence) {
    return (
      <>
        <p className="text-lg">{puzzleData.sequence.join(", ")}</p>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 mt-3 w-full"
        />
      </>
    );
  }

  if (puzzleData.question) {
    return (
      <>
        <p className="text-lg">{puzzleData.question}</p>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 mt-3 w-full"
        />
      </>
    );
  }

  return null;
}

export default PuzzleRenderer;
