import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="mb-6">Page Not Found</p>

        <Link
          to="/"
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
