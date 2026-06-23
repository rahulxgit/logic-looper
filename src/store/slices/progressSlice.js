import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dailyActivity: {}, // { date: { solved, score, timeTaken, difficulty } }
  todayProgress: null,
  totalSolved: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageScore: 0,
  totalTime: 0,
  synced: false,
  loading: false,
  error: null,
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Set all activity
    setAllActivity: (state, action) => {
      state.dailyActivity = action.payload
      state.totalSolved = Object.values(action.payload).filter(
        (a) => a.solved
      ).length
    },

    // Update today's progress
    setTodayProgress: (state, action) => {
      state.todayProgress = action.payload
    },

    // Record completion
    recordCompletion: (state, action) => {
      const { date, score, timeTaken, difficulty } = action.payload
      state.dailyActivity[date] = {
        solved: true,
        score,
        timeTaken,
        difficulty,
        date,
      }
      state.todayProgress = state.dailyActivity[date]
    },

    // Update streak
    setStreak: (state, action) => {
      state.currentStreak = action.payload.current
      state.bestStreak = action.payload.best
    },

    // Calculate stats
    updateStats: (state, action) => {
      state.averageScore = action.payload.averageScore
      state.totalTime = action.payload.totalTime
    },

    // Sync status
    setSynced: (state, action) => {
      state.synced = action.payload
    },

    // Loading & error
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setAllActivity,
  setTodayProgress,
  recordCompletion,
  setStreak,
  updateStats,
  setSynced,
  setLoading,
  setError,
} = progressSlice.actions

export default progressSlice.reducer
