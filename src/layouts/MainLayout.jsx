import Navbar from "../components/common/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 flex justify-center items-start px-4 py-10 sm:py-12">

        {/* Content Container */}
        <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 fade-in">
          {children}
        </div>

      </main>
    </div>
  );
}

export default MainLayout;
