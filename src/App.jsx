import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

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
 * Architecture Goals:
 * - Client-first offline architecture
 * - GitHub-style heatmap dashboard
 * - Scalable UI layout
 * - Brand color alignment
 * - Protected routing
 * - Heatmap at bottom (GitHub style)
 */

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      {/* ============================================ */}
      {/* GLOBAL APP WRAPPER */}
      {/* ============================================ */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: "Poppins, sans-serif",
          background: "#F6F5F5",
          color: "#222222",
        }}
      >
        {/* ============================================ */}
        {/* HEADER — BRAND ALIGNED */}
        {/* ============================================ */}
        <header
          className="px-8 py-5 shadow-sm"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #D9E2FF",
          }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "#414BEA" }}
              >
                Logic Looper
              </h1>
              <p className="text-sm opacity-70">
                Daily Puzzle • Streak • Contribution Tracker
              </p>
            </div>

            {user && (
              <div className="text-sm opacity-80">
                Signed in
              </div>
            )}
          </div>
        </header>

        {/* ============================================ */}
        {/* MAIN CONTENT AREA */}
        {/* ============================================ */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">

          <Routes>

            {/* Protected Game Route */}
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

            {/* Login */}
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

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>

        </main>

        {/* ============================================ */}
        {/* HEATMAP — GITHUB STYLE (BOTTOM SECTION) */}
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

              <div className="mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#3D3B40" }}
                >
                  Daily Activity Heatmap
                </h2>

                <p className="text-sm opacity-70">
                  Tracks daily puzzle completion, streak continuity and
                  performance intensity. Works fully offline.
                </p>
              </div>

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
        {/* FOOTER — OFFLINE FIRST MESSAGE */}
        {/* ============================================ */}
        <footer
          className="text-center text-sm py-4"
          style={{
            background: "#F6F5F5",
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
