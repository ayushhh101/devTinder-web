import React, { useState } from 'react'
import UserCard from './UserCard'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addUser } from '../utils/userSlice'
import { BASE_URL } from '../utils/constants'

const EditProfile = ({ user }) => {
  const [firstName, setfirstName] = useState(user.firstName)
  const [lastName, setlastName] = useState(user.lastName)
  const [photoUrl, setphotoUrl] = useState(user.photoUrl)
  const [age, setage] = useState(user.age || '')
  const [gender, setgender] = useState(user.gender || '')
  const [about, setabout] = useState(user.about)
  const [error, seterror] = useState('')
  const dispatch = useDispatch();
  const [showtoast, setshowtoast] = useState(false)

  const saveProfile = async () => {
    //Clearing any errors
    seterror('')
    try {
      const res = await axios.patch(`${BASE_URL}/profile/edit`, {
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about
      }, { withCredentials: true })
      dispatch(addUser(res.data.data))
      setshowtoast(true)
      setTimeout(()=>{
        setshowtoast(false)
      },3000)
    } catch (error) {
      seterror(error?.response?.data || 'Something went wrong')
    }
  }
  return (
    <>
      <div className='flex justify-center my-5 gap-7'>
        <div className='flex items-center justify-center'>
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
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
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">Photo</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setphotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setage(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <input
                    type="text"
                    value={gender}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setgender(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setabout(e.target.value)}
                  />
                </label>
              </div>
              <p className='text-center text-red-500'>{error}</p>
              <div className="card-actions justify-center">
                <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
              </div>
            </div>
          </div>
        </div>
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
      </div>
      {showtoast && 
      (
      <div className="toast toast-top toast-center">
        <div className="alert alert-success">
          <span>Profile Saved Successfully</span>
        </div>
      </div>
      )
    }
    </>
  )
}

export default EditProfile