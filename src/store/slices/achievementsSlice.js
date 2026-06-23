import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  unlockedAchievements: [], // [{ id, unlockedAt, progress }]
  achievements: [], // Full achievement definitions
  totalPoints: 0,
  level: 1,
  nextLevelProgress: 0,
  loading: false,
  error: null,
}

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    // Set all achievements
    setAchievements: (state, action) => {
      state.achievements = action.payload
    },

    // Unlock achievement
    unlockAchievement: (state, action) => {
      const { id, points } = action.payload
      if (!state.unlockedAchievements.find((a) => a.id === id)) {
        state.unlockedAchievements.push({
          id,
          unlockedAt: new Date().toISOString(),
          progress: 100,
        })
        state.totalPoints += points
      }
    },

    // Update achievement progress
    updateAchievementProgress: (state, action) => {
      const { id, progress } = action.payload
      const achievement = state.unlockedAchievements.find((a) => a.id === id)
      if (achievement) {
        achievement.progress = progress
      }
    },

    // Update level and points
    updateLevel: (state, action) => {
      state.level = action.payload.level
      state.nextLevelProgress = action.payload.progress
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
  setAchievements,
  unlockAchievement,
  updateAchievementProgress,
  updateLevel,
  setLoading,
  setError,
} = achievementsSlice.actions

export default achievementsSlice.reducer
