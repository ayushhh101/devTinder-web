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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 py-10">
        <div className="flex justify-center gap-12 relative max-w-7xl mx-auto px-6">
          {/* Edit Profile Card - Left Side */}
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-8 tracking-tight">
                  Edit Profile
                </h2>
                
                <div className="space-y-6">
                  {[
                    { label: 'First Name', value: firstName, setValue: setfirstName },
                    { label: 'Last Name', value: lastName, setValue: setlastName },
                    { label: 'Photo URL', value: photoUrl, setValue: setphotoUrl },
                    { label: 'Age', value: age, setValue: setage },
                    { label: 'Gender', value: gender, setValue: setgender },
                    { label: 'About', value: about, setValue: setabout },
                  ].map(({ label, value, setValue }, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-indigo-100">
                        {label}
                      </label>
                      {label === 'About' ? (
                        <textarea
                          value={value}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
                          placeholder={`Enter your ${label.toLowerCase()}`}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      ) : (
                        <input
                          type={label === 'Age' ? 'number' : 'text'}
                          value={value}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
                          placeholder={`Enter your ${label.toLowerCase()}`}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-6 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-200 text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    onClick={saveProfile}
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Card - Right Side */}
          <div className="w-full max-w-md">
            <div className="sticky top-10">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Preview
              </h3>
              <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showtoast && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400/30">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="font-medium">Profile saved successfully!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EditProfile