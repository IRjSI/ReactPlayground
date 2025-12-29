import { AuthContext, AuthContextType } from "../context/authContext";
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext) as AuthContextType;

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { username, email, password }
      );

      if (response.data.success) {
        login(response.data.data);
        navigate("/home");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-900">
      
      {/* Ambient Glow Effects */}
      <div className="absolute -top-10 left-10 h-64 w-64 bg-cyan-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 bg-purple-600/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        
        {/* Side Image */}
        <div className="hidden md:block h-full bg-[url('https://images.unsplash.com/photo-1517504734587-2890819debab?q=80&w=1639')] bg-cover bg-center opacity-90" />

        {/* Form Section */}
        <div className="w-full max-w-md p-10 text-white mx-auto">

          <div className="text-center space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-gray-400 text-sm">
              Glad to see you again! Login to continue
            </p>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-400 text-center">{error}</div>
          )}

          <form onSubmit={submitHandler} className="space-y-6 mt-6">
            
            <div>
              <label className="text-sm text-gray-300">Username</label>
              <input
                className="mt-1 w-full rounded-lg bg-gray-900/70 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                className="mt-1 w-full rounded-lg bg-gray-900/70 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                className="mt-1 w-full rounded-lg bg-gray-900/70 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-gray-600" />
            <span className="text-gray-400 text-sm">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-600" />
          </div>

          {/* Google Login */}
          <button
            onClick={() =>
              window.location.replace(`${import.meta.env.VITE_BACKEND_URL}/auth/google`)
            }
            className="w-full rounded-lg bg-white text-black font-semibold px-5 py-2 flex items-center justify-center gap-3 hover:bg-gray-200 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"
              className="w-6 h-6"
            />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
