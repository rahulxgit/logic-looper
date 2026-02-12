import { loginWithGoogle } from "../services/authService";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[350px]">
        <h1 className="text-2xl font-bold mb-6">Logic Looper</h1>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
