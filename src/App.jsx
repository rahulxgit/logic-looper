import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./services/firebase";
import { loginWithGoogle, logout } from "./services/authService";

import Game from "./pages/Game";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        
        {/* 🔝 Navbar */}
        <nav className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-md">
          <h1 className="text-xl font-bold">Logic Looper</h1>

          {user ? (
            <div className="flex items-center gap-4">
              <span>{user.displayName}</span>

              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              )}

              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Login with Google
            </button>
          )}
        </nav>

        {/* 🔀 Routes */}
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              user ? (
                <Game user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login />
              )
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
