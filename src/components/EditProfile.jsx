import React, { useState } from 'react'
import UserCard from './UserCard'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addUser } from '../utils/userSlice'
import { BASE_URL } from '../utils/constants'

const EditProfile = ({ user }) => {
  const [firstName, setfirstName] = useState(user.firstName || '')
  const [lastName, setlastName] = useState(user.lastName || '')
  const [photoUrl, setphotoUrl] = useState(user.photoUrl || '')
  const [age, setage] = useState(user.age || '')
  const [gender, setgender] = useState(user.gender || '')
  const [about, setabout] = useState(user.about || '')
  const [skills, setskills] = useState(user.skills || [])
  const [headline, setheadline] = useState(user.headline || '')
  const [currentPosition, setcurrentPosition] = useState(user.currentPosition || '')
  const [location, setlocation] = useState(user.location || '')
  const [githubUrl, setgithubUrl] = useState(user.githubUrl || '')
  const [linkedinUrl, setlinkedinUrl] = useState(user.linkedinUrl || '')
  const [projects, setprojects] = useState(user.projects || [])
  
  const [newSkill, setnewSkill] = useState('')
  const [error, seterror] = useState('')
  const dispatch = useDispatch();
  const [showtoast, setshowtoast] = useState(false)

  const saveProfile = async () => {
    seterror('')
    try {
      const res = await axios.patch(`${BASE_URL}/profile/edit`, {
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
        skills,
        headline,
        currentPosition,
        location,
        githubUrl,
        linkedinUrl,
        projects
      }, { withCredentials: true })
      dispatch(addUser(res.data.data))
      setshowtoast(true)
      setTimeout(() => {
        setshowtoast(false)
      }, 3000)
    } catch (error) {
      seterror(error?.response?.data || 'Something went wrong')
    }
  }

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setskills([...skills, trimmed])
      setnewSkill('')
    }
  }
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills]
    updatedSkills.splice(index, 1)
    setskills(updatedSkills)
  }


  const updateProjectField = (index, field, value) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setprojects(updatedProjects)
  }
  const addProject = () => {
    setprojects([...projects, { title: '', description: '', link: '' }])
  }
  const removeProject = (index) => {
    const updatedProjects = [...projects]
    updatedProjects.splice(index, 1)
    setprojects(updatedProjects)
  }

  const genderOptions = ['', 'male', 'female', 'others']

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="flex justify-center gap-12 relative max-w-7xl mx-auto px-6">
          {/* Edit Profile Card - Left Side */}
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl border border-indigo-500/30 overflow-auto max-h-[90vh] p-8">
              <h2 className="text-2xl font-bold text-center text-white mb-8 tracking-tight">
                Edit Profile
              </h2>

              <div className="space-y-6">
                {[
                  { label: 'First Name', value: firstName, setValue: setfirstName },
                  { label: 'Last Name', value: lastName, setValue: setlastName },
                  { label: 'Photo URL', value: photoUrl, setValue: setphotoUrl },
                  { label: 'Age', value: age, setValue: setage, type: 'number' },
                  { label: 'Gender', value: gender, setValue: setgender, type: 'select', options: genderOptions },
                  { label: 'About', value: about, setValue: setabout, textarea: true },
                  { label: 'Headline', value: headline, setValue: setheadline },
                  { label: 'Current Position', value: currentPosition, setValue: setcurrentPosition },
                  { label: 'Location', value: location, setValue: setlocation },
                  { label: 'GitHub URL', value: githubUrl, setValue: setgithubUrl },
                  { label: 'LinkedIn URL', value: linkedinUrl, setValue: setlinkedinUrl },
                ].map(({ label, value, setValue, textarea, type, options }, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-indigo-100">
                      {label}
                    </label>
                    {textarea ? (
                      <textarea
                        value={value}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50  focus:ring-orange-400 focus:border-transparent transition duration-200"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    ) : type === 'select' ? (
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50  focus:ring-orange-400 focus:border-transparent transition duration-200"
                      >
                        {options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt === '' ? 'Select gender' : opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type || 'text'}
                        value={value}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setnewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="flex-grow px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50  focus:ring-orange-400"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() } }}
                    />
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2 transition"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <div key={i} className="bg-orange-600/70 text-white rounded-full px-3 py-1 flex items-center gap-2">
                        <span>{skill}</span>
                        <button type="button" onClick={() => handleRemoveSkill(i)} className="font-bold text-lg leading-none hover:text-orange-400">&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-3">
                    Projects
                  </label>
                  {projects.map((proj, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/10 rounded-xl space-y-3 border border-white/20">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-semibold text-lg">Project {index + 1}</h4>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-400 hover:text-red-600 font-bold"
                          aria-label="Remove Project"
                        >
                          &times;
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title"
                        value={proj.title}
                        onChange={(e) => updateProjectField(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <textarea
                        placeholder="Description"
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProjectField(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <input
                        type="text"
                        placeholder="Link (e.g. GitHub, Demo URL)"
                        value={proj.link}
                        onChange={(e) => updateProjectField(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
                  >
                    + Add Project
                  </button>
                </div>

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

          {/* User Profile Card - Right Side */}
          <div className="w-full max-w-md">
            <div className="sticky top-10">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Preview
              </h3>
              <UserCard user={{
                firstName,
                lastName,
                photoUrl,
                age,
                gender,
                about,
                skills,
                headline,
                currentPosition,
                location,
                githubUrl,
                linkedinUrl,
                projects
              }} />
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
