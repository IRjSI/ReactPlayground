import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import LandingPage from './Pages/LandingPage'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import { useContext } from 'react'
import { AuthContext } from './context/authContext'

function App() {
  //@ts-ignore
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className='bg-[#121212] text-white'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        {isLoggedIn ? (
          <>
            <Route path='/home' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
          </>
        ) : null }
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
