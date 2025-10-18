import { User } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux' // ✅ Added Redux hooks
import { logout } from '../app/features/authslice' // ✅ Import logout action

const Navbar = () => {
  const { user } = useSelector((state) => state.auth) // ✅ Get user from Redux
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const LogoutUser = () => {
    dispatch(logout()) // ✅ Dispatch logout action to clear Redux state
    navigate('/') 
  }

  // ✅ Safety check - show loading if user data not available
  if (!user) {
    return (
      <div className='shadow bg-white'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
          <Link to="/"> 
            <img src="/logo.svg" alt="logo" className='h-11 w-auto'/>
          </Link>
          <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden'>Loading...</p>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to="/"> 
          <img src="/logo.svg" alt="logo" className='h-11 w-auto'/>
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <p className='max-sm:hidden'>Hi, {user.name}</p>
          <button 
            onClick={LogoutUser} 
            className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
