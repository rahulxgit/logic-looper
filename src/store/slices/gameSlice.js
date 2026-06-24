import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPuzzle: null,
  puzzleType: null,
  puzzleInstance: null,
  isCompleted: false,
  isSolved: false,
  userInput: '',
  result: null,
  score: null,
  attempts: 0,
  timeElapsed: 0,
  hintsUsed: 0,
  hintsAvailable: 3,
  loading: false,
  error: null,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Puzzle initialization
    setPuzzle: (state, action) => {
      state.currentPuzzle = action.payload.puzzleData
      state.puzzleInstance = action.payload.instance
      state.puzzleType = action.payload.type
      state.attempts = 0
      state.timeElapsed = 0
      state.hintsUsed = 0
      state.isSolved = false
      state.result = null
      state.score = null
    },

    // Input management
    setUserInput: (state, action) => {
      state.userInput = action.payload
    },

    // Submit answer
    submitAnswer: (state) => {
      state.attempts += 1
    },

    // Answer validation result
    setResult: (state, action) => {
      state.result = action.payload.isCorrect
      if (action.payload.isCorrect) {
        state.isSolved = true
      }
    },

    // Score calculation
    setScore: (state, action) => {
      state.score = action.payload
    },

    // Mark as completed (recorded to DB)
    markCompleted: (state) => {
      state.isCompleted = true
    },

    // Hint management
    useHint: (state) => {
      if (state.hintsAvailable > 0) {
        state.hintsUsed += 1
        state.hintsAvailable -= 1
      }
    },

    resetHints: (state) => {
      state.hintsUsed = 0
      state.hintsAvailable = 3
    },

    // Timer
    incrementTimer: (state) => {
      state.timeElapsed += 1
    },

    // Reset puzzle
    resetPuzzle: (state) => {
      state.userInput = ''
      state.result = null
      state.isSolved = false
      state.attempts = 0
    },

    // Daily reset
    resetDaily: () => {
      return initialState
    },

    // Loading & errors
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setPuzzle,
  setUserInput,
  submitAnswer,
  setResult,
  setScore,
  markCompleted,
  useHint,
  resetHints,
  incrementTimer,
  resetPuzzle,
  resetDaily,
  setLoading,
  setError,
} = gameSlice.actions

export default gameSlice.reducer
