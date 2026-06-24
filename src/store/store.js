import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/gameSlice'
import progressReducer from './slices/progressSlice'
import userReducer from './slices/userSlice'
import achievementsReducer from './slices/achievementsSlice'
import puzzleReducer from './slices/puzzleSlice'

/**
 * ============================================
 * REDUX STORE CONFIGURATION
 * ============================================
 * Centralized state management for:
 * - Game state (puzzles, scoring)
 * - Progress tracking (daily activity)
 * - User state (auth, preferences)
 * - Achievements (badges, milestones)
 *
 * Features:
 * - Redux DevTools integration
 * - Thunk middleware for async operations
 * - Serializable state
 * - Time-travel debugging
 */
export const store = configureStore({
  reducer: {
    game: gameReducer,
    progress: progressReducer,
    user: userReducer,
    achievements: achievementsReducer,
    puzzle: puzzleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase auth objects in serialization check
        ignoredActions: ['user/setCurrentUser', 'user/setAuthLoading'],
        ignoredActionPaths: ['payload.user'],
        ignoredPaths: ['user.currentUser'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
})

export default store
