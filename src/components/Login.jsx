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
      seterror(error?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-white'>
      <div className="w-[400px] p-6 bg-white border-2 border-[#FF0099] shadow-xl rounded-lg">
        <h2 className="text-center text-3xl font-bold text-[#FF0099] mb-6 ">
          {isLoginForm ? "Welcome Back!" : "Create an Account"}
        </h2>

        {!isLoginForm && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:border-[#FF0099] focus:ring-[#FF0099] focus:ring-1"
                onChange={(e) => setfirstName(e.target.value)} 
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:border-[#FF0099] focus:ring-[#FF0099] focus:ring-1"
                onChange={(e) => setlastName(e.target.value)} 
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email ID</label>
          <input 
            type="text" 
            value={emailId} 
            className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:border-[#FF0099] focus:ring-[#FF0099] focus:ring-1"
            onChange={(e) => setemailId(e.target.value)} 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input 
            type="password" 
            value={password} 
            className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:border-[#FF0099] focus:ring-[#FF0099] focus:ring-1"
            onChange={(e) => setpassword(e.target.value)} 
          />
        </div>

        <p className='text-center text-red-500 font-semibold'>{error}</p>

        <div className="flex justify-center mt-4">
          <button 
            className="w-full py-2 bg-[#FF0099] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF3A3A] transition transform hover:scale-105"
            onClick={isLoginForm ? handleLogin : handleSignUp}>
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </div>

        <p 
          className='text-center text-gray-700 mt-4 cursor-pointer hover:underline'
          onClick={() => setisLoginForm(!isLoginForm)}>
          {isLoginForm ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  )
}

export default Login