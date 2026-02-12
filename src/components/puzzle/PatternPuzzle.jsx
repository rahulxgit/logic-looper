import { useState } from "react";

function PatternPuzzle({ data, onSubmit }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <p className="text-lg font-medium mb-4 text-center">
        {data.sequence.join(" → ")}
      </p>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter next value"
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={() => onSubmit(input)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
      >
        Submit
      </button>
    </div>
  );
}

export default PatternPuzzle;
