import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "../../services/authService";
import { getStreak } from "../../features/streak/streakService";

function Navbar() {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  // Listen auth state safely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Update streak when component loads + when localStorage changes
  useEffect(() => {
    const update = () => setStreak(getStreak());

    update();

    // Listen for streak changes from other components
    window.addEventListener("storage", update);

    return () => window.removeEventListener("storage", update);
  }, []);

  // Safe logout handler
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/20 shadow-md">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">
              L
            </div>

            <h1 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Logic Looper
            </h1>
          </div>

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-3">

              {/* Streak */}
              <div className="text-sm text-white font-medium">
                🔥 {streak}
              </div>

              {/* Username */}
              <span className="hidden md:block text-sm text-white/90">
                {user.displayName || "Player"}
              </span>

              {/* Profile Image */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-white/50 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`px-3 py-1.5 text-sm rounded-lg text-white transition ${
                  loggingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500/80 hover:bg-red-600"
                }`}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
