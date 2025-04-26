import { useState } from "react";
import Header from "../components/Header";

const LandingPage = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">

    <div className="px-24">
      <Header />
    </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [background-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="flex flex-col items-center justify-center text-center text-7xl font-semibold h-1/2 relative z-10 space-y-6 mt-4">
        
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex items-center justify-center gap-2 transition-all duration-500`}
      >
        <div className="flex items-center justify-center gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" 
            alt="LeetCode Logo"
            className={`w-8 h-8 transition-all duration-500 ${hovered ? "opacity-50 translate-x-2 animate-bounce" : "opacity-0 translate-x-0"} -rotate-45`}
          />
          <span>LeetCode</span>
        </div>

        <span>for</span>

        <div className="flex items-center justify-center gap-4">
          <span className="text-cyan-400 italic drop-shadow-[0_0_15px_cyan]">React</span>
          <img 
            src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" 
            alt="React Logo"
            className={`w-8 h-8 transition-all duration-500 ${hovered ? "opacity-50 -translate-x-2 animate-bounce" : "opacity-0 translate-x-0"} rotate-45`}
          />
        </div>
      </div>

        <div className="text-lg font-normal text-gray-300">
          Solve challenges. Level up your React skills.
        </div>

        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
          Start Solving →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-16 relative z-10">
        
        <div className="border border-cyan-400 bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20">
          <h2 className="text-2xl font-bold mb-2 text-cyan-400">Learn the Basics</h2>
          <p className="text-gray-300">
            Master JSX, components, props, and hooks through hands-on challenges.
          </p>
        </div>

        <div className="border border-cyan-400 bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20">
          <h2 className="text-2xl font-bold mb-2 text-cyan-400">Build Real Projects</h2>
          <p className="text-gray-300">
            Apply your knowledge by building mini-projects after each stage.
          </p>
        </div>

        <div className="border border-cyan-400 bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20">
          <h2 className="text-2xl font-bold mb-2 text-cyan-400">Master Advanced Concepts</h2>
          <p className="text-gray-300">
            Dive into context, performance optimization, custom hooks, and more.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;
