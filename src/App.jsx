import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"

import HeatmapContainer from "./components/heatmap/HeatmapContainer"
import { auth } from "./services/firebase"

import Game from "./pages/Game"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

/**
 * ============================================
 * LOGIC LOOPER — PRODUCTION APP LAYOUT
 * ============================================
 *
 * Improvements:
 * - Single global navbar (fix double navbar issue)
 * - Online/offline indicator
 * - Logout support
 * - Streak placeholder (future feature)
 * - Clean SaaS layout structure
 */

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  /**
   * 🔐 Firebase Auth Listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  /**
   * 🌐 Online / Offline Status Listener
   */
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)

    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  /**
   * 🚪 Logout Handler
   */
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  /**
   * ⏳ Loading Screen
   */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-lg"
        style={{
          fontFamily: "Poppins, sans-serif",
          background: "#F6F5F5",
          color: "#222222",
        }}
      >
        Loading Logic Looper...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: "Poppins, sans-serif",
          background: "#F6F5F5",
          color: "#222222",
        }}
      >
        {/* ============================================ */}
        {/* GLOBAL NAVBAR (SINGLE SOURCE) */}
        {/* ============================================ */}
        <header
          className="px-8 py-4 shadow-sm"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #D9E2FF",
          }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            {/* Logo */}
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "#414BEA" }}
              >
                Logic Looper
              </h1>
              <p className="text-xs opacity-70">
                Daily Puzzle • Streak • Contribution Tracker
              </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 text-sm">

              {/* Online Status */}
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="opacity-70">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {/* Future Streak Counter Placeholder */}
              {user && (
                <div className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
                  🔥 Streak — Coming Soon
                </div>
              )}

              {/* Auth Section */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ background: "#F05537" }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ============================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================ */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Game user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login />
                )
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* ============================================ */}
        {/* HEATMAP — GITHUB STYLE BOTTOM */}
        {/* ============================================ */}
        {user && (
          <section
            className="px-6 py-8"
            style={{
              background: "#FFFFFF",
              borderTop: "1px solid #D9E2FF",
            }}
          >
            <div className="max-w-7xl mx-auto">

              <h2 className="text-lg font-semibold mb-2">
                Daily Activity Heatmap
              </h2>

              <p className="text-sm opacity-70 mb-4">
                Tracks daily puzzle completion, streak continuity and
                performance intensity. Works fully offline.
              </p>

              <div
                className="p-6 rounded-xl shadow-sm"
                style={{ background: "#F8EDFF" }}
              >
                <HeatmapContainer />
              </div>

            </div>
          </section>
        )}

        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}
        <footer
          className="text-center text-sm py-4"
          style={{
            borderTop: "1px solid #D9E2FF",
          }}
        >
          <span className="opacity-70">
            Offline-first tracking • Minimal server sync • Scalable architecture
          </span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
