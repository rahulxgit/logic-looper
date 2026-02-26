import { useState } from "react";
import useHint from "../../hooks/useHint";

function BinaryPuzzle({ data, userInput, setUserInput }) {
  const { hintsLeft, useHint: consumeHint } = useHint();
  const [hintMessage, setHintMessage] = useState("");

  // Safety check
  if (!data) {
    return (
      <div className="text-red-500 text-center">
        No puzzle data available
      </div>
    );
  }

  // Handle hint click
  const handleHint = () => {
    const allowed = consumeHint();

    if (!allowed) {
      setHintMessage("❌ No hints left today!");
      return;
    }

    // If your puzzle has hint field
    if (data.hint) {
      setHintMessage(`💡 ${data.hint}`);
    } else {
      setHintMessage("💡 Try thinking in binary pattern!");
    }
  };

  return (
    <div className="space-y-5 fade-in">

      {/* Hint Button */}
      <div className="flex justify-center">
        <button
          onClick={handleHint}
          disabled={hintsLeft === 0}
          className={`px-4 py-2 rounded-lg text-white transition
            ${
              hintsLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          💡 Use Hint ({hintsLeft})
        </button>
      </div>

      {/* Hint Message */}
      {hintMessage && (
        <div className="text-center text-yellow-400 font-medium">
          {hintMessage}
        </div>
      )}

      {/* Question */}
      <div className="text-lg font-semibold text-center">
        {data.question}
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your answer..."
        className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

    </div>
  );
}

export default BinaryPuzzle;
