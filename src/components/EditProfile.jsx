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
      <div className="flex justify-center my-10 gap-14 relative">
      {/* Edit Profile Card - Stays on the Left */}
      <div className="w-1/3 flex justify-end">
        <div className="card w-96 shadow-xl bg-[#ff1a5c] text-white border-2 border-[#ff4b2b]">
          <div className="card-body">
            <h2 className="card-title justify-center text-white">Edit Profile</h2>
            <div>
              {[
                { label: 'First Name', value: firstName, setValue: setfirstName },
                { label: 'Last Name', value: lastName, setValue: setlastName },
                { label: 'Photo', value: photoUrl, setValue: setphotoUrl },
                { label: 'Age', value: age, setValue: setage },
                { label: 'Gender', value: gender, setValue: setgender },
                { label: 'About', value: about, setValue: setabout },
              ].map(({ label, value, setValue }, index) => (
                <label key={index} className="form-control w-full max-w-xs my-3">
                  <div className="label">
                    <span className="label-text text-white">{label}</span>
                  </div>
                  <input
                    type="text"
                    value={value}
                    className="input input-bordered w-full max-w-xs text-black"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </label>
              ))}
            </div>
            <p className="text-center text-red-300">{error}</p>
            <div className="card-actions justify-center">
              <button
                className="btn bg-gradient-to-r from-[#ff1a5c] to-[#ff4b2b] text-white font-bold hover:opacity-90"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card - Centered */}
      <div className="w-1/3 flex justify-start">
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
      </div>

      {/* Toast Notification - Clearly Visible */}
      {showtoast && (
        <div className="fixed top-5 right-5 z-50">
          <div className="alert bg-[#ff1a5c] text-white shadow-lg px-6 py-3 rounded-lg">
            <span>✔ Profile Saved Successfully</span>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default EditProfile