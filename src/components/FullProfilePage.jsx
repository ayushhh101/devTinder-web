import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

// Loader/skeleton component (optional)
// import ProfileSkeleton from './ProfileSkeleton';

const FullProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/user/${userId}`, { withCredentials: true });
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleRequest = async(userId) =>{
    try {
      const res = await await axios.post(`${BASE_URL}/request/send/interested/${userId}`, {}, { withCredentials: true });
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center">Loading profile...</div>;
  if (!profile) return <div className="h-screen flex items-center justify-center text-red-600">User Not Found</div>;

  const {
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    headline,
    currentPosition,
    location,
    about,
    skills = [],
    githubUrl,
    linkedinUrl,
    projects = [],
  } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-blue-100 py-12 px-2">
      <div className="max-w-3xl mx-auto bg-white/80 rounded-2xl shadow-xl ring-1 ring-indigo-100 pb-8 overflow-hidden">
        {/* Hero/Business Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-indigo-600/80 to-blue-600/60 p-8 rounded-b-2xl shadow-md">
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-lg bg-white">
            <img src={photoUrl} alt={`${firstName} ${lastName} avatar`} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{firstName} {lastName}</h1>
            <div className="text-lg md:text-xl text-indigo-100 mt-1">{headline}</div>
            {currentPosition && (
              <div className="text-indigo-200 text-base">{currentPosition}</div>
            )}
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start mt-2">
              {location && <div className="flex items-center text-sky-200 text-sm gap-1"><i className="ri-map-pin-2-fill" />{location}</div>}
              {age && <div className="flex items-center text-indigo-100 text-sm gap-1"><i className="ri-user-3-fill" />{age}</div>}
              {gender && <div className="flex items-center text-indigo-100 text-sm gap-1"><i className="ri-user-heart-fill" />{gender}</div>}
            </div>
            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="text-white/80 hover:text-[#fb923c] text-2xl transition">
                  <i className="ri-github-fill"></i>
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="text-[#0077b5] hover:text-[#fb923c] text-2xl transition">
                  <i className="ri-linkedin-box-fill"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="px-8 mt-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">About</h2>
          <p className="text-gray-800 text-base">{about}</p>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="px-8 mt-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="px-8 mt-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-lg shadow p-4">
                  <div className="font-semibold text-indigo-900">{proj.title}</div>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline text-sm">View project</a>
                  )}
                  <div className="text-gray-700 text-sm mt-1">{proj.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* (Optional) Contact or Connect button */}
        <div className="px-8 mt-8 flex justify-center">
          <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-all"
          onClick={()=>{
            handleRequest(userId)
          }}>
            Connect or Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullProfilePage;
