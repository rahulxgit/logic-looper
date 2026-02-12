import Navbar from "../components/common/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600">
      <Navbar />

      <main className="flex justify-center items-start px-4 py-12">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
