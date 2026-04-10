import { AuthContext, AuthContextType } from "../context/authContext";
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
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
        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
        { username, email, password }
      );

      if (response.data.success) {
        login(response.data.data);
        navigate("/home");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-6">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-gray-800"
      >

        <div className="hidden md:flex flex-col justify-between p-10 bg-[#0b0b0b] border-r border-gray-800">

          <div>
            <div className="text-xs text-gray-500 mb-4 tracking-wide">
              execution engine
            </div>

            <h2 className="text-3xl font-semibold leading-tight">
              Your code will be
              <br />
              <span className="text-cyan-400">executed.</span>
            </h2>

            <p className="mt-4 text-gray-400 text-sm max-w-sm">
              Runs in a real browser. Clicked. Tested. Verified.
            </p>
          </div>

          <div className="mt-10 bg-[#0f0f0f] border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
            <div className="text-gray-600">$ POST /user/signup</div>

            <div className="text-cyan-400">→ validating credentials</div>
            <div className="text-cyan-400">→ creating user</div>
            <div className="text-cyan-400">→ issuing jwt</div>
            <div className="text-cyan-400">→ connecting to engine</div>

            <div className="text-green-400">✓ ready</div>
          </div>

        </div>

        <div className="w-full max-w-md p-10 mx-auto text-white">

          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Run your first solution
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Create an account to start execution
            </p>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6 mt-6" onSubmit={submitHandler}>

            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                className="mt-1 w-full rounded-md bg-[#111] border border-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                className="mt-1 w-full rounded-md bg-[#111] border border-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                className="mt-1 w-full rounded-md bg-[#111] border border-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-md bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Start executing"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-gray-800" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-800" />
          </div>

          <button
            onClick={() =>
              window.location.replace(`${import.meta.env.VITE_BACKEND_URL}/auth/google`)
            }
            className="w-full rounded-md bg-white text-black font-medium px-5 py-2 flex items-center justify-center gap-3 hover:bg-gray-200 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"
              className="w-5 h-5"
            />
            Use Google
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Resume execution
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Signup;