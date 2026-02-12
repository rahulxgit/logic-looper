import { useState } from "react";

function NumberMatrixPuzzle({ data, onSubmit }) {
  const [grid, setGrid] = useState(data.grid);

  const handleChange = (rowIndex, colIndex, value) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={(e) =>
                handleChange(rowIndex, colIndex, e.target.value)
              }
              className="w-14 h-14 text-center border rounded"
            />
          ))
        )}
      </div>

      <button
        onClick={() => onSubmit(grid)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        Submit
      </button>
    </div>
  );
}

export default NumberMatrixPuzzle;
