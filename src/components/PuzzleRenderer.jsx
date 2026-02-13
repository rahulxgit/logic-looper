import UniversalPuzzle from "./UniversalPuzzle";

function PuzzleRenderer({ puzzleData, userInput, setUserInput }) {
  return (
    <UniversalPuzzle
      puzzleData={puzzleData}
      userInput={userInput}
      setUserInput={setUserInput}
    />
  );
}

export default PuzzleRenderer;
