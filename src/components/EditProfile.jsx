import React, { useState } from 'react'
import UserCard from './UserCard'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addUser } from '../utils/userSlice'
import { BASE_URL } from '../utils/constants'

const EditProfile = ({ user }) => {
  const { _id } = user;
  const [firstName, setfirstName] = useState(user.firstName || '')
  const [lastName, setlastName] = useState(user.lastName || '')
  const [photoUrl, setphotoUrl] = useState(user.photoUrl || '')
  const [age, setage] = useState(user.age || '')
  const [gender, setgender] = useState(user.gender || '')
  const [about, setabout] = useState(user.about || '')
  const [skills, setskills] = useState(user.skills || [])
  const [bannerUrl, setbannerUrl] = useState(user.bannerUrl || '');
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
      <div className="min-h-screen w-full bg-white">
        <div className="flex flex-col md:flex-row justify-center gap-16 max-w-6xl mx-auto px-11">
          {/* Edit Profile Card - Left Side */}
          <div className="w-full max-w-md mx-auto mb-10 md:mb-0">
            <div className="bg-white rounded-3xl border border-[#e4e7ee] shadow-xl px-8 py-9">
              <h2 className="text-2xl font-bold text-center text-[#333333] mb-8 tracking-tight">
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
                  { label: 'Banner Image URL', value: bannerUrl, setValue: setbannerUrl },
                  { label: 'GitHub URL', value: githubUrl, setValue: setgithubUrl },
                  { label: 'LinkedIn URL', value: linkedinUrl, setValue: setlinkedinUrl },
                ].map(({ label, value, setValue, textarea, type, options }, index) => (
                  <div key={index} className="space-y-1">
                    <label className="block text-sm font-medium text-[#0099CC]">
                      {label}
                    </label>
                    {textarea ? (
                      <textarea
                        value={value}
                        rows={3}
                        className="w-full px-4 py-3 border bg-white border-[#e4e7ee] rounded-xl text-[#333333] placeholder-gray-400 focus:ring-orange-400 focus:border-transparent transition duration-200"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    ) : type === 'select' ? (
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e7ee] rounded-xl text-[#313944] placeholder-gray-400 focus:ring-[#1790a7] focus:border-[#1790a7] outline-none transition"
                      >
                        {options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt === '' ? 'Select gender' : opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type || 'text'}
                        value={value}
                        className="w-full px-4 py-2 bg-white border border-[#e4e7ee] rounded-xl text-[#313944] placeholder-gray-400 focus:ring-[#1790a7] focus:border-[#1790a7] outline-none transition"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-[#313944] mb-1">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setnewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="flex-grow px-4 py-2 rounded-xl border border-[#e4e7ee] bg-white text-[#313944] placeholder-gray-400 focus:ring-[#ff6767] focus:border-[#ff6767]"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() } }}
                    />
                    <button
                      className="bg-[#ff6767] hover:bg-[#fa5151] text-white rounded-xl px-4 py-2 transition font-semibold"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <div key={i} className="bg-[#1790a7] text-white rounded-full px-3 py-1 flex items-center gap-2">
                        <span>{skill}</span>
                        <button type="button" onClick={() => handleRemoveSkill(i)} className="font-bold text-lg leading-none hover:text-orange-400">&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#313944] mb-1">
                    Projects
                  </label>
                  {projects.map((proj, index) => (
                    <div key={index} className="mb-4 p-4bg-[#f6fbff] rounded-xl space-y-2 border border-[#e4e7ee]">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[#1790a7] font-semibold">Project {index + 1}</h4>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-[#ff6767] hover:text-[#fa5151] font-bold text-lg"
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
                        className="w-full px-3 py-2 rounded-lg border border-[#e4e7ee] bg-white text-[#313944] placeholder-gray-400 focus:ring-[#1790a7] focus:border-[#1790a7]"
                      />
                      <textarea
                        placeholder="Description"
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProjectField(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#e4e7ee] bg-white text-[#313944] placeholder-gray-400 focus:ring-[#1790a7] focus:border-[#1790a7]"
                      />
                      <input
                        type="text"
                        placeholder="Link (e.g. GitHub, Demo URL)"
                        value={proj.link}
                        onChange={(e) => updateProjectField(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#e4e7ee] bg-white text-[#313944] placeholder-gray-400 focus:ring-[#1790a7] focus:border-[#1790a7]"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="w-full bg-[#ff6767] hover:bg-[#fa5151] text-white font-semibold py-2 px-6 rounded-xl transition"
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
                  className="w-full bg-[#1790a7] hover:bg-[#13697c] text-white font-semibold py-3 px-6 rounded-xl transition shadow"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Card - Right Side */}
          <div className="w-full max-w-md mx-auto">
            <div className="top-10">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Preview
              </h3>
              <UserCard user={{
                _id,
                firstName,
                lastName,
                photoUrl,
                age,
                gender,
                about,
                skills,
                bannerUrl,
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
