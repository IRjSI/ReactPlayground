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
import About from './Pages/About'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { TermService } from './components/TermService'
import ChallengeLayout from './components/ChallengeLayout'

function App() {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;

  return (
    <div className='bg-[#121212] text-white'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/About' element={<About />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<TermService />} />
        {isLoggedIn ? (
          <>
            <Route path='/home' element={<Home />} />
            <Route path='/challenge/:challengeId' element={<ChallengeLayout />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/add-challenge' element={<AddChallenge />} />
          </>
        ) : null}

        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App