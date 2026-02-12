import { useState } from "react";

function BinaryPuzzle({ data, onSubmit }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <p className="text-lg font-medium mb-4 text-center">
        {data.question}
      </p>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter 0 or 1"
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={() => onSubmit(input)}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
      >
        Submit
      </button>
    </div>
  );
}

export default BinaryPuzzle;
