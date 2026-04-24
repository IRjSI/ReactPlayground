import Header from "../components/Header";

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [bg-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      <div className="relative px-6 sm:px-10 md:px-20 lg:px-32 mt-4">
        <Header />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]">
          About
        </h1>

        <div className="mt-6 border border-cyan-400/40 bg-linear-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg shadow-cyan-500/10 p-6 space-y-4">
          <p className="text-gray-300">
            React Playground helps you learn React by solving real, interactive challenges.
            Instead of solving algorithms, you build components that actually run inside a browser.
          </p>

          <p className="text-gray-400 text-sm">
            Simple. Practical. Focused on real frontend skills.
          </p>
        </div>
      </div>
    </div>
  );
}
