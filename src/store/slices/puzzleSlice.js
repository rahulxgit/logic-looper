import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timerActive: false,
  startTime: null,
  elapsed: 0,
  hintsUsed: 0,
  completed: false,
};

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    startTimer: (state) => {
      if (!state.timerActive && !state.completed) {
        state.timerActive = true;
        state.startTime = Date.now();
      }
    },
    stopTimer: (state) => {
      state.timerActive = false;
      if (state.startTime) {
        state.elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      }
    },
    useHint: (state) => {
      if (state.hintsUsed < 3) {
        state.hintsUsed += 1;
      }
    },
    resetPuzzleState: (state) => {
      state.timerActive = false;
      state.startTime = null;
      state.elapsed = 0;
      state.hintsUsed = 0;
      state.completed = false;
    },
    setCompleted: (state) => {
      state.completed = true;
    }
  }
});

export const { startTimer, stopTimer, useHint, resetPuzzleState, setCompleted } = puzzleSlice.actions;
export default puzzleSlice.reducer;
