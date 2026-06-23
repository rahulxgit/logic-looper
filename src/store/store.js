import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/gameSlice'
import progressReducer from './slices/progressSlice'
import userReducer from './slices/userSlice'
import achievementsReducer from './slices/achievementsSlice'

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
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
