import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext, AuthContextType } from "../context/authContext"
import { Code2, Menu, X } from "lucide-react"

function Header() {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all">
              <Code2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">React</span>
              <span className="text-cyan-400">Playground</span>
            </span>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  U
                </div>
                <span className="text-sm font-medium text-white">Profile</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 animate-fadeIn">

            {/* Mobile Auth Buttons */}
            <div className="space-y-2 px-4 pt-4 border-t border-gray-800">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/25"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    U
                  </div>
                  <span className="font-medium text-white">View Profile</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;