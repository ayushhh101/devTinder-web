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
      seterror(error?.response?.data?.message || 'Something went wrong' + error)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-3">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left illustration / branding section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-white w-1/2 p-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-800">DevTinder</span>
          </div>
          {/* Tagline (optional) */}
          <div className="text-base text-center text-gray-500 px-2">
            Where developers connect, collaborate, and grow.
          </div>
        </div>
        {/* Right login/signup form section */}
        <div className="flex w-full md:w-1/2 min-h-[450px] items-center justify-center bg-[#f9fafb] relative">
          <div className="w-full max-w-[370px] mx-auto py-10 px-6 bg-white rounded-2xl shadow border border-zinc-100">

            <div className="flex flex-col items-center mb-7">
              <h2 className="text-2xl font-bold text-[#333333] mb-2 tracking-tight">
                {isLoginForm ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isLoginForm
                  ? "Log in and reconnect with devs"
                  : "Sign up and join the dev community"}
              </p>
            </div>

            <div className="space-y-5">
              {!isLoginForm && (
                <>
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-400 text-gray-700"
                      placeholder="First Name"
                      onChange={e => setfirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-400 text-gray-700"
                      placeholder="Last Name"
                      onChange={e => setlastName(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div>
                <input
                  type="email"
                  value={emailId}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-400 text-gray-700"
                  placeholder="Email Address"
                  onChange={e => setemailId(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-400 text-gray-700"
                  placeholder="Password"
                  onChange={e => setpassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="mt-4 p-2 text-center text-pink-600 text-sm bg-pink-50 rounded-lg border border-pink-300">{error}</div>
            )}
            <div className="mt-8">
              <button
                className="w-full py-3 bg-[#0099CC] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 capitalize"
                onClick={isLoginForm ? handleLogin : handleSignUp}
              >
                {isLoginForm ? "Sign In" : "Sign Up"}
              </button>
            </div>
            <div className="mt-6 text-center">
              <span
                onClick={() => setisLoginForm(prev => !prev)}
                className="text-gray-600 hover:text-indigo-500 font-semibold text-sm cursor-pointer transition"
              >
                {isLoginForm
                  ? <>"Don't have an account? <span className="text-[#FF6B6B]">Sign Up</span></>
                  : (
                    <>
                      Already have an account?{" "}
                      <span className="text-[#FF6B6B]">Sign In</span>
                    </>
                  )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login