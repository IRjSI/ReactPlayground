import { useContext, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Home from "../components/Home";

const LandingPage = () => {
  const [hovered, setHovered] = useState(false);
  
  //@ts-ignore
  const { isLoggedIn } = useContext(AuthContext); 

  if (isLoggedIn) return <Home />

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-2 sm:p-4">

      <div className="px-4 sm:px-8 md:px-16 lg:px-24">
        <Header />
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [background-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="flex flex-col items-center justify-center text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold h-1/2 relative z-10 space-y-4 sm:space-y-6 px-2 mt-8">
        
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex flex-wrap items-center justify-center gap-2 transition-all duration-500"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" 
              alt="LeetCode Logo"
              className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ${hovered ? "opacity-50 translate-x-2 animate-bounce" : "opacity-0 translate-x-0"} -rotate-45`}
            />
            <span>LeetCode</span>
          </div>

          <span>for</span>

          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <span className="text-cyan-400 italic drop-shadow-[0_0_15px_cyan]">React</span>
            <img 
              src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" 
              alt="React Logo"
              className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ${hovered ? "opacity-50 -translate-x-2 animate-bounce" : "opacity-0 translate-x-0"} rotate-45`}
            />
          </div>
        </div>

        <div className="text-base sm:text-lg font-normal text-gray-300 px-4">
          Solve challenges. Level up your React skills.
        </div>

        <Link to='/login' className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
          Start Solving →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16 relative z-10 mt-8 sm:mt-4">
        
        <div className="border border-cyan-400 bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20 cursor-pointer">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400">Learn the Basics</h2>
          <p className="text-sm sm:text-base text-gray-300">
            Master JSX, components, props, and hooks through hands-on challenges.
          </p>
        </div>

        <div className="border border-cyan-400 bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20 cursor-pointer">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400">Build Real Projects</h2>
          <p className="text-sm sm:text-base text-gray-300">
            Apply your knowledge by building mini-projects after each stage.
          </p>
        </div>

        <div className="border border-cyan-400 bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-cyan-500/20 cursor-pointer sm:col-span-2 lg:col-span-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400">Master Advanced Concepts</h2>
          <p className="text-sm sm:text-base text-gray-300">
            Dive into context, performance optimization, custom hooks, and more.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;