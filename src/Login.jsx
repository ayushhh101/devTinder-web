import React from 'react'
import { useState } from 'react'
import axios from 'axios'
const Login = () => {

  const [emailId, setemailId] = useState('')
  const [password, setpassword] = useState('')

  const handleLogin = async ()  => {

    try {
      const res = await axios.post('http://localhost:3000/login',{
        emailId,
        password
      },{withCredentials: true})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex items-center justify-center'>
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
            <label className="form-control w-full max-w-xs my-3">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input 
              type="text" 
              value={emailId} 
              className="input input-bordered w-full max-w-xs"
              onChange={(e)=> setemailId(e.target.value)} 
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
              onChange={(e)=> setpassword(e.target.value)}
              />
            </label>
          </div>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login