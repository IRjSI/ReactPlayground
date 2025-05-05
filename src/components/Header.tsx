import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext"

function Header() {
  //@ts-ignore
  const { isLoggedIn } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="border border-cyan-500/30 p-2 backdrop-blur-md bg-cyan-500/5 rounded-full shadow-sm hover:shadow-cyan-500/10 transition-shadow">
          <div className="hidden md:flex items-center justify-between">
            <div className="flex gap-4 lg:gap-6 items-center justify-center ml-2 lg:ml-4">
              <li className="list-none">
                <Link to="/" className="text-cyan-100 hover:text-white px-2 lg:px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                  Home
                </Link>
              </li> 
              <li className="list-none">
                <Link to="/about" className="text-cyan-100 hover:text-white px-2 lg:px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                  About
                </Link>
              </li>
              <li className="list-none">
                <Link to="/contact" className="text-cyan-100 hover:text-white px-2 lg:px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                  Contact
                </Link>
              </li>
            </div>
            <div className="py-1">
              <Link to={'/login'} className="px-4 lg:px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
                Login
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-cyan-100 font-medium text-lg pl-2">
              <span className="text-white">Learn</span>React
              </Link>
              
              <button 
                onClick={toggleMenu}
                className="flex items-center justify-center p-2 rounded-full text-cyan-100 hover:text-white hover:bg-cyan-500/20 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {menuOpen && (
              <div className="mt-3 pb-2 space-y-1 border-t border-cyan-500/30 pt-2">
                <div className="pt-2 pb-1">
                  <Link 
                    to={'/login'} 
                    className="block w-full text-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header