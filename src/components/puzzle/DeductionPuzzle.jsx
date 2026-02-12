import { useState } from "react";

function DeductionPuzzle({ data, onSubmit }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <p className="text-lg font-medium mb-4 text-center">
        {data.question}
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter answer"
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={() => onSubmit(input)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
      >
        Submit
      </button>
    </div>
  );
}

export default DeductionPuzzle;
