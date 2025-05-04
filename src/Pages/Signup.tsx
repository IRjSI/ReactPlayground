import { AuthContext } from '../context/authContext'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  //@ts-ignore
  const { login } = useContext(AuthContext)

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, {
        username,
        email,
        password
      })
      if (response.data.success) {
        login(response.data.data)
        navigate('/home')
      } else {
        setError(response.data.message || 'Signup failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black/90 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 items-center shadow-2xl rounded-2xl overflow-hidden bg-[#101014]">
        <div
          className="hidden md:block h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517504734587-2890819debab?q=80&w=1639&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8 p-10 text-white"
        >
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">Login to continue</p>
          </div>

          {error && <div className="text-sm text-red-400 text-center">{error}</div>}

          <form className="space-y-6" onSubmit={submitHandler}>
            <div className="space-y-3">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  className="mt-1 w-full rounded-md bg-white/90 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md bg-white/90 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="mt-1 w-full rounded-md bg-white/90 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-md bg-indigo-600 px-5 py-2 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">
              login
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export default Signup
