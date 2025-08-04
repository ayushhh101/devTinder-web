import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import '../components-css/UserCard.css';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  console.log(user);
  const dispatch = useDispatch();
  const {
    _id,
    firstName,
    lastName,
    photoUrl = '',
    age,
    about,
    headline,
    currentPosition,
    location,
    skills = [],
    githubUrl,
    linkedinUrl
  } = user || {};

  const displayName = [firstName, lastName].filter(Boolean).join(' ');

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-400 mt-2 rounded-3xl"
      style={{ fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}
    >
      <div className="relative min-h-full w-full max-w-md rounded-3xl shadow-2xl  ring-indigo-200/20 overflow-hidden border  border-indigo-100/10">
        {/* Image Section */}
        <div className="relative h-full w-full overflow-hidden z-10">
          <img
            src={photoUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* DETAILS */}
        <div className="flex flex-col gap-4 p-7 bg-gradient-to-tr from-[#17163a]/10 to-[#192146]/50">
          {/* Name and age */}
          <div className="flex items-end gap-3">
            <h1 className="text-3xl font-extrabold text-[#fb923c]">{displayName}</h1>
            <span className="text-2xl text-slate-200 font-light">{age || '18'}</span>
          </div>
          {/* Headline & Position */}
          {headline && <div className="text-[17px] text-indigo-50 leading-tight">{headline}</div>}
          {currentPosition && <div className="text-indigo-200 text-base">{currentPosition}</div>}
          {/* Location */}
          {location && (
            <div className="flex items-center text-indigo-300 text-[15px] mt-1 gap-1">
              <i className="ri-map-pin-2-fill mr-1 text-sky-400"></i> {location}
            </div>
          )}
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="font-medium text-xs text-[#fb923c] mb-1">Skills</div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, i) => (
                  <span key={i} className="bg-indigo-600/60 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="bg-gray-700/70 text-gray-100 px-3 py-1 rounded-full text-xs shadow">+{skills.length - 6} more</span>
                )}
              </div>
            </div>
          )}
          {/* Bio */}
          {about && (
            <div>
              <div className="font-medium text-xs text-[#fb923c] mb-1">Bio</div>
              <div className="text-[15px] text-gray-200 leading-snug line-clamp-4">{about}</div>
            </div>
          )}
          {/* Social Links */}
          <div className="flex items-center gap-5 mt-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-white/80 hover:text-[#fb923c] text-2xl transition"
              >
                <i className="ri-github-fill"></i>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-[#0077b5] hover:text-[#fb923c] text-2xl transition"
              >
                <i className="ri-linkedin-box-fill"></i>
              </a>
            )}
          </div>
          <Link to={`/profile/${user._id}`} className="text-indigo-600 font-semibold hover:underline">View Full Profile</Link>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              className="w-1/2 py-2 rounded-full bg-gradient-to-r from-[#1e293b] to-[#22224a] text-white text-2xl flex justify-center items-center hover:from-slate-600 hover:to-slate-800 hover:scale-[1.07] transition-all shadow-lg border border-gray-600"
              onClick={() => handleSendRequest('ignored', _id)}
              aria-label="Ignore user"
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              className="w-1/2 py-2 rounded-full bg-gradient-to-tr from-rose-500 via-orange-400 to-fuchsia-600 text-white text-2xl flex justify-center items-center font-bold hover:to-violet-500 hover:scale-[1.07] shadow-xl border-none"
              onClick={() => handleSendRequest('interested', _id)}
              aria-label="Connect with user"
            >
              <i className="ri-heart-2-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
