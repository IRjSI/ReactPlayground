import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/authContext";
import { Code2, Menu, X } from "lucide-react";

function Header() {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-md bg-[#111] border border-gray-800 group-hover:border-cyan-500/50 transition">
              <Code2 size={18} className="text-cyan-400" />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                React<span className="text-cyan-400">Playground</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-md hover:bg-cyan-500 hover:text-black transition"
                >
                  Run code
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-gray-800 rounded-md hover:border-cyan-500/50 transition"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">
                  U
                </div>
                <span className="text-sm text-gray-300">Profile</span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-3">

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-400 hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block mx-4 text-center px-4 py-2 bg-cyan-500 text-black rounded-md font-medium"
                >
                  Run code
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block mx-4 px-4 py-2 text-center bg-[#111] border border-gray-800 rounded-md text-gray-300"
              >
                Profile
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;