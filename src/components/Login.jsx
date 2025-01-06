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
    <div className='flex items-center justify-center'>
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">{isLoginForm ? "Login" : "SignUp"}</h2>
          <div>
            {!isLoginForm ?
              <>
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setfirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setlastName(e.target.value)}
                  />
                </label>
              </> : null}
            <label className="form-control w-full max-w-xs my-3">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setemailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-3">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="text"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setpassword(e.target.value)}
              />
            </label>
          </div>
          <p className='text-center text-red-500'>{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={isLoginForm? handleLogin : handleSignUp}>
              {isLoginForm ? "Login" : "SignUp"}
            </button>
          </div>
          <p className='text-center cursor-pointer' onClick={() => setisLoginForm(!isLoginForm)}>
            {isLoginForm ? "Don't have an account?" : "Already have an account?"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login