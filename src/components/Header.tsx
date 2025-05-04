import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext"

function Header() {
  //@ts-ignore
  const { isLoggedIn } = useContext(AuthContext);

    return (
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-cyan-500/30 p-2 backdrop-blur-md bg-cyan-500/5 rounded-full shadow-sm hover:shadow-cyan-500/10 transition-shadow">
            <ul className="flex items-center justify-between">
                <>
                  <div className="flex gap-6 items-center justify-center ml-4">
                    <li>
                      <Link to="/" className="text-cyan-100 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                        Home
                      </Link>
                    </li> 
                    <li>
                      <Link to="/about" className="text-cyan-100 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-cyan-100 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-cyan-500/20">
                        Contact
                      </Link>
                    </li>
                  </div>
                  <div className="py-1">
                    <Link to={'/login'} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
                      Login
                    </Link>
                  </div>
                </>
              )
            </ul>
          </div>
        </div>
      </header>
    )
  }
  
  export default Header