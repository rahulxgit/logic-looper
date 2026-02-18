import { useEffect, useState } from "react"
import { auth } from "../../services/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { logout } from "../../services/authService"
import { getStreak } from "../../features/streak/streakService"

/**
 * ============================================
 * GLOBAL NAVBAR — PRODUCTION VERSION
 * ============================================
 *
 * Features:
 * - auth state listener
 * - streak counter
 * - online/offline indicator
 * - profile display
 * - logout handling
 * - heatmap + streak auto refresh
 * - offline-first UX
 */

function Navbar() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loggingOut, setLoggingOut] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  /**
   * Auth listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  /**
   * Streak updates
   * - on mount
   * - when activity updates
   * - when localStorage changes
   */
  useEffect(() => {
    const update = () => setStreak(getStreak())

    update()

    window.addEventListener("storage", update)
    window.addEventListener("activityUpdated", update)

    return () => {
      window.removeEventListener("storage", update)
      window.removeEventListener("activityUpdated", update)
    }
  }, [])

  /**
   * Online / Offline status
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
   * Logout handler
   */
  const handleLogout = async () => {
    if (loggingOut) return

    try {
      setLoggingOut(true)
      await logout()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      setLoggingOut(false)
    }
  }

  /**
   * Avatar fallback
   */
  const getInitial = () =>
    user?.displayName?.charAt(0)?.toUpperCase() || "U"

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg shadow-md"
      style={{
        background: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid #D9E2FF",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white"
              style={{ background: "#414BEA" }}
            >
              L
            </div>

            <h1
              className="text-lg font-semibold"
              style={{ color: "#414BEA" }}
            >
              Logic Looper
            </h1>
          </div>

          {/* Right Section */}
          {user && (
            <div className="flex items-center gap-4">

              {/* Online Status */}
              <div className="flex items-center gap-1 text-xs opacity-70">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </div>

              {/* Streak */}
              <div className="text-sm font-medium text-orange-500">
                🔥 {streak}
              </div>

              {/* Username */}
              <span className="hidden md:block text-sm text-gray-700">
                {user.displayName || "Player"}
              </span>

              {/* Profile */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full border object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {getInitial()}
                </div>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`px-4 py-2 text-sm rounded-lg text-white transition ${
                  loggingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#F05537] hover:opacity-90"
                }`}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
