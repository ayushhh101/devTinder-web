import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
const Login = () => {

  const [emailId, setemailId] = useState('')
  const [password, setpassword] = useState('');
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [isLoginForm, setisLoginForm] = useState(false)
  const [error, seterror] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        emailId,
        password
      }, { withCredentials: true });

      dispatch(addUser(res.data.data))
      navigate('/feed')
    } catch (error) {
      seterror(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, {
        firstName,
        lastName,
        emailId,
        password
      }, { withCredentials: true });

      dispatch(addUser(res.data.data))
      navigate('/profile')
    } catch (error) {
      seterror(error?.response?.data?.message || 'Something went wrong'+ error)
    }
  }

  return (
    <div 
      className='flex justify-center items-center min-h-screen p-4'
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      }}
    >
      <div className="w-full max-w-md p-8 bg-[#0f172a] bg-opacity-90 backdrop-blur-sm border-2 border-[#8b5cf6] shadow-2xl rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#f97316] mb-2 drop-shadow-lg">
            {isLoginForm ? "Welcome Back!" : "Join DevTinder"}
          </h2>
          <p className="text-gray-300 text-sm">
            {isLoginForm ? "Sign in to continue your journey" : "Create your account to get started"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {!isLoginForm && (
            <>
              <div>
                <label className="block text-[#f97316] font-semibold mb-2 text-sm">
                  First Name
                </label>
                <input 
                  type="text" 
                  value={firstName} 
                  className="w-full p-3 bg-[#1e293b] border-2 border-gray-600 text-white rounded-lg focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your first name"
                  onChange={(e) => setfirstName(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-[#f97316] font-semibold mb-2 text-sm">
                  Last Name
                </label>
                <input 
                  type="text" 
                  value={lastName} 
                  className="w-full p-3 bg-[#1e293b] border-2 border-gray-600 text-white rounded-lg focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your last name"
                  onChange={(e) => setlastName(e.target.value)} 
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[#f97316] font-semibold mb-2 text-sm">
              Email Address
            </label>
            <input 
              type="email" 
              value={emailId} 
              className="w-full p-3 bg-[#1e293b] border-2 border-gray-600 text-white rounded-lg focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50 focus:outline-none transition-all duration-300 placeholder-gray-400"
              placeholder="Enter your email"
              onChange={(e) => setemailId(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-[#f97316] font-semibold mb-2 text-sm">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              className="w-full p-3 bg-[#1e293b] border-2 border-gray-600 text-white rounded-lg focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50 focus:outline-none transition-all duration-300 placeholder-gray-400"
              placeholder="Enter your password"
              onChange={(e) => setpassword(e.target.value)} 
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mt-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg'>
            <p className='text-center text-red-300 font-medium text-sm'>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <button 
            className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <p 
            className='text-gray-300 cursor-pointer hover:text-[#f97316] transition-colors duration-300 font-medium'
            onClick={() => setisLoginForm(!isLoginForm)}
          >
            {isLoginForm ? "Don't have an account? " : "Already have an account? "}
            <span className="text-[#f97316] hover:text-orange-400 font-semibold">
              {isLoginForm ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#8b5cf6] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#f97316] rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  )
}

export default Login