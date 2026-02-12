import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "../../services/authService";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
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

              <span className="hidden md:block text-sm text-white/80">
                {user.displayName}
              </span>

              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-white/50"
                />
              )}

              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-500/80 hover:bg-red-600 transition text-white"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
