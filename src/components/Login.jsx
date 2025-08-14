import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'

function getErrorMessage(error) {
  if (error.response) {
    // Received error response from backend
    return error.response.data?.message || 'An error occurred. Please try again.'
  } else if (error.request) {
    // Request was made, but no response (network/server error)
    return 'Network error. Please check your connection.'
  } else {
    return 'Unexpected error. Please try again.'
  }
}

const Login = () => {

  const [emailId, setemailId] = useState('')
  const [password, setpassword] = useState('');
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [isLoginForm, setisLoginForm] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const validateFields = () => {
    const errs = {}
    if (!emailId) errs.emailId = 'Email is required'
    else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(emailId)) errs.emailId = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password at least 6 chars'
    if (!isLoginForm) {
      if (!firstName) errs.firstName = 'First name required'
      if (!lastName) errs.lastName = 'Last name required'
    }
    return errs
  }

  const handleLogin = async () => {
    setError('')
    setFieldErrors({})
    const errs = validateFields()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        emailId,
        password
      }, { withCredentials: true });

      dispatch(addUser(res.data.data))
      navigate('/feed')
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setError('')
    setFieldErrors({})
    const errs = validateFields()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setLoading(true)
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
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-alibaba px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left illustration / branding section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#F5F7FA] w-1/2 p-10">
          <img src="linkspark logo main.png" alt="main-logo" className='max-h-64 mb-6 mx-auto object-contain'/>
          <h1 className="font-bold text-[44px] text-textPrimary">LinkSpark</h1>
          <p className="text-center text-lg text-textPrimary max-w-xs mt-3">
            Where developers connect, collaborate, and grow.
          </p>
        </div>
        {/* Right login/signup form section */}
        <div className="flex w-full md:w-1/2 min-h-[450px] items-center justify-center bg-white relative">
          <div className="w-full max-w-[370px] mx-auto py-10 px-6 bg-white rounded-2xl shadow border border-[#F5F7FA]">

            <div className="flex flex-col items-center mb-7">
              <h2 className="text-[32px] font-bold text-textPrimary mb-2 tracking-tight">
                {isLoginForm ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-textPrimary text-sm">
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
                      className="w-full p-4 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-[#0099CC] text-[#333] text-lg"
                      placeholder="First Name"
                      onChange={e => setfirstName(e.target.value)}
                    />
                    {fieldErrors.firstName && <p className="text-red-600">{fieldErrors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      className="w-full p-4 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-[#0099CC] text-[#333] text-lg"
                      placeholder="Last Name"
                      onChange={e => setlastName(e.target.value)}
                    />
                    {fieldErrors.lastName && <p className="text-sm text-red-600 mt-1">{fieldErrors.lastName}</p>}
                  </div>
                </>
              )}
              <div>
                <input
                  type="email"
                  value={emailId}
                  className="w-full p-4 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-[#0099CC] text-[#333] text-lg"
                  placeholder="Email Address"
                  onChange={e => setemailId(e.target.value)}
                />
                {fieldErrors.emailId && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.emailId}</p> )}
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  className="w-full p-4 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-[#0099CC] text-[#333] text-lg"
                  placeholder="Password"
                  onChange={e => setpassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>  )}
              </div>
            </div>
            {error && (
              <div className="mt-4 p-2 text-center text-pink-600 text-sm bg-pink-50 rounded-lg border border-pink-300">{error}</div>
            )}
            <div className="mt-8">
              <button
                className="w-full py-3 rounded-[12px] font-bold text-lg shadow-md hover:shadow-lg transition-all bg-primary text-white hover:bg-[#007aa3]"
                onClick={isLoginForm ? handleLogin : handleSignUp}
              >
                {isLoginForm ? "Sign In" : "Sign Up"}
              </button>
            </div>
            <div className="mt-6 text-center">
              <span
                onClick={() => setisLoginForm(prev => !prev)}
                className="text-[#333] font-semibold text-base cursor-pointer"
              >
                {isLoginForm
                  ? <>Don't have an account? <span className="text-[#FF6B6B]">Sign Up</span></>
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