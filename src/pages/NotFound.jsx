import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-center px-4 fade-in">

      <div className="space-y-4">

        {/* 404 Title */}
        <h1 className="text-5xl sm:text-6xl font-bold">404</h1>

        {/* Message */}
        <p className="text-lg text-white/80">
          Page Not Found
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Go Home
        </Link>

      </div>

    </div>
  );
}

export default NotFound;
