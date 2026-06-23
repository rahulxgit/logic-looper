import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  preferences: {
    theme: 'light',
    notifications: true,
    difficulty: 'medium',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set current user
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = !!action.payload
    },

    // Set auth loading
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },

    // Set auth error
    setAuthError: (state, action) => {
      state.error = action.payload
    },

    // Logout
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },

    // Update preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      }
    },
  },
})

export const {
  setCurrentUser,
  setAuthLoading,
  setAuthError,
  logout,
  updatePreferences,
} = userSlice.actions

export default userSlice.reducer
