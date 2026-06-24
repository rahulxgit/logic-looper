import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/gameSlice'
import puzzleReducer from './slices/puzzleSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    puzzle: puzzleReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/setCurrentUser', 'user/setAuthLoading'],
        ignoredActionPaths: ['payload.user'],
        ignoredPaths: ['user.currentUser'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
})

export default store
