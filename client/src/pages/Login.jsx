import React from 'react'
import { User2Icon, MailIcon, LockIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authslice'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlState = searchParams.get('state');
  
  const [state, setState] = React.useState(urlState || "login")
  const [isLoading, setIsLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  React.useEffect(() => {
    if (urlState) {
      setState(urlState);
    }
  }, [urlState])

  // ✅ FIXED: API call with Render URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const API_BASE = import.meta.env.VITE_SERVER_URL || 'https://resume-builder-3-xfol.onrender.com';
      const endpoint = state === "login" ? "/api/users/login" : "/api/users/register";
      
      console.log('🔄 Making API call to:', `${API_BASE}${endpoint}`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (data.token && data.user) {
        dispatch(login({ 
          token: data.token, 
          user: data.user 
        }))
        localStorage.setItem('token', data.token)
        toast.success(`Successfully ${state === "login" ? "logged in" : "signed up"}`)
        navigate('/app')
      } else {
        throw new Error('Invalid response from server: missing token or user data');
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // ✅ Better error handling
      if (error.message.includes('401') || error.message.includes('Invalid')) {
        toast.error('Invalid email or password')
      } else if (error.message.includes('400')) {
        toast.error('Bad request - check your input data')
      } else if (error.message.includes('409')) {
        toast.error('User already exists with this email')
      } else if (error.message.includes('Failed to fetch')) {
        toast.error('Cannot connect to server. Please check if backend is running.')
      } else {
        toast.error(error.message || `Failed to ${state}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const switchMode = () => {
    const newState = state === "login" ? "register" : "login";
    setState(newState);
    setFormData({ name: '', email: '', password: '' });
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>

        {/* Name field (only for signup) */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border-none outline-none ring-0 w-full"
              value={formData.name}
              onChange={handleChange}
              required={state !== "login"}
            />
          </div>
        )}

        {/* Email field */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MailIcon size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="border-none outline-none ring-0 w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password field */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <LockIcon size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            className="border-none outline-none ring-0 w-full"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="mt-4 text-left text-green-500">
          <button className="text-sm" type="button">Forgot password?</button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : (
            state === "login" ? "Login" : "Sign up"
          )}
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          {state === "login" ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={switchMode}
            className="text-green-500 hover:underline cursor-pointer ml-1"
          >
            Click here
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login