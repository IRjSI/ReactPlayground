import { useContext, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Home from "../components/Home";

const LandingPage = () => {
  const [hovered, setHovered] = useState(false);

  //@ts-ignore
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) return <Home />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Background Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [bg-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative px-6 sm:px-10 md:px-20 lg:px-32 mt-4">
        <Header />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center mt-20 md:mt-24 px-6">
        
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center gap-3 sm:gap-5 transition-all duration-500"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
            className={`w-7 sm:w-10 transition-all duration-500 ${hovered ? "opacity-60 -translate-x-1" : "opacity-0"}`}
          />

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Practice <span className="text-cyan-400 drop-shadow-[0_0_15px_#22d3ee]">React</span>,
            <br />
            Level Up Your Skills
          </h1>

          <img
            src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
            className={`w-7 sm:w-10 transition-all duration-500 ${hovered ? "opacity-60 translate-x-1" : "opacity-0"}`}
          />
        </div>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mt-4">
          Interactive coding playground with automated validation, like LeetCode, but built for React.
        </p>

        <Link
          to="/login"
          className="mt-6 px-6 sm:px-8 py-3 bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-full text-lg font-semibold transition-all transform hover:scale-[1.04] shadow-lg shadow-cyan-500/30"
        >
          Start Solving →
        </Link>
      </div>

      {/* FEATURE CARDS */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-6 sm:px-10 md:px-20 lg:px-32 mt-16 pb-20">

        <FeatureCard
          title="Learn the Basics"
          desc="Master JSX, components, props, and hooks through hands-on practice."
        />

        <FeatureCard
          title="Real-World Problems"
          desc="Challenges designed to simulate real frontend engineering scenarios."
        />

        <FeatureCard
          title="Track Your Progress"
          desc="Streaks, heatmap, stats and motivation. Stay consistent."
          center
        />
      </div>
    </div>
  );
};

function FeatureCard({ title, desc, center }: any) {
  return (
    <div
      className={`border border-cyan-400/40 bg-linear-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 
      backdrop-blur-lg rounded-2xl shadow-lg shadow-cyan-500/10 p-6
      hover:shadow-cyan-500/30 transition-transform duration-300 hover:scale-[1.03]
      ${center ? "sm:col-span-2 lg:col-span-1 mx-auto" : ""}`}
    >
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h2>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

export default LandingPage;
