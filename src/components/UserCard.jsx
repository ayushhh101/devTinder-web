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
    <div className="w-full h-screen flex justify-center items-center mt-2 rounded-2xl shadow-2xl">
      <div className="relative min-h-full w-full max-w-md rounded-3xl shadow-2xl bg-white ring-indigo-200/20 overflow-hidden border  border-indigo-100/10">
        {/* Image Section */}
        <div className="relative h-full w-full z-10">
          <img
            src={photoUrl}
            alt={displayName}
            className="w-full h-full object-cover shadow-md"
          />
        </div>
        {/* DETAILS */}
        <div className="flex flex-col gap-4 p-7 w-full">
          {/* Name and age */}
          <div className="flex items-end gap-3">
            <h1 className="text-2xl font-bold text-[#0099CC]">{displayName}</h1>
            <span className="text-xl font-normal text-[#333333]">{age || '18'}</span>
          </div>
          {/* Headline & Position */}
          {headline && <div className="text-lg text-[#333333] leading-tight">{headline}</div>}
          <div className='flex flex-row justify-between'>
            {currentPosition && <div className="text-[#333333] text-base">{currentPosition}</div>}
            {/* Location */}
            {location && (
              <div className="flex items-center text-[#333333] text-base mt-1 gap-1">
                <i className="ri-map-pin-2-fill mr-1 text-sky-400"></i> {location}
              </div>
            )}
          </div>
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, i) => (
                  <span key={i} className="bg-[#ecf3f7] uppercase text-[#1790a7] px-5 py-2 rounded-md text-xs font-semibold shadow-sm whitespace-nowrap">
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs shadow">+{skills.length - 5} more</span>
                )}
              </div>
            </div>
          )}
          {/* Social Links */}
          <div className="flex items-center gap-4 mt-1">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-[#374151] hover:text-[#1790a7] text-xl transition"
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
                className="text-[#0077b5] hover:text-[#1790a7] text-xl transition"
              >
                <i className="ri-linkedin-box-fill"></i>
              </a>
            )}
          </div>
          <Link to={`/profile/${user._id}`} className="text-[#1790a7] font-medium hover:underline text-sm mt-1">View Full Profile</Link>

          {/* Buttons */}
          <div className="flex justify-center gap-32 mt-4">
            <button
              className="w-16 h-16 rounded-full flex justify-center items-center bg-[#f0f3f7] hover:bg-[#e3eaf6] transition shadow border-2 border-[#e3eaf6] text-2xl"
              onClick={() => handleSendRequest('ignored', _id)}
              aria-label="Ignore user"
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              className="w-16 h-16 rounded-full flex justify-center items-center bg-[#FF6B6B]  text-white text-2xl font-bold shadow-xl hover:scale-105 active:scale-100 transition-transform"
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
