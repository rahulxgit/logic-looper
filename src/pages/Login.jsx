import { useState } from "react";
import { loginWithGoogle } from "../services/authService";

function Login() {
  const [loading, setLoading] = useState(false);

  // Safe login handler
  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 fade-in">

      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl text-center w-full max-w-[350px]">

        {/* App Title */}
        <h1 className="text-2xl font-bold mb-6">
          Logic Looper
        </h1>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Signing in..." : "Login with Google"}
        </button>

      </div>

    </div>
  );
}

export default Login;
