export function ErrorState({ city, message }) {
  return (
    <main className="relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 min-h-[100vh] text-white p-4 sm:p-6">
      <div className="relative z-10 w-full max-w-md mx-auto bg-red-500/20 backdrop-blur-md border border-red-500/40 rounded-2xl p-8 text-center shadow-lg">
        {/* Error Icon */}
        <svg
          className="w-16 h-16 mx-auto mb-4 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-2xl font-bold mb-2">Weather Data Unavailable</h2>
        <p className="text-gray-300 mb-4">{message}</p>
        
        {city && (
          <p className="text-sm text-gray-400 mb-6">
            Unable to find weather data for &quot;{city}&quot;
          </p>
        )}

        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Try Another City
        </a>
      </div>
    </main>
  );
}
