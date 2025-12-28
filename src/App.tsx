import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import LandingPage from './Pages/LandingPage'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import { useContext } from 'react'
import { AuthContext, AuthContextType } from './context/authContext'
import Signup from './Pages/Signup'
import AddChallenge from './components/AddChallenge'
import AuthSuccess from './components/AuthSuccess'

function App() {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;

  return (
    <div className='bg-[#121212] text-white'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        {isLoggedIn ? (
          <>
            <Route path='/home' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/challenge' element={<AddChallenge />} />
          </>
        ) : null }

        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App