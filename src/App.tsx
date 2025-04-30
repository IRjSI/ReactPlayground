import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import LandingPage from './Pages/LandingPage'
import Login from './Pages/Login'

function App() {

  return (
    <div className='bg-[#121212] text-white'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
