import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import '../components-css/UserCard.css';
import { Link } from 'react-router-dom';
import { globalSocket } from './NotificationListener';

const UserCard = ({ user , variant = 'profile'}) => {
  
   const isSearch = variant === 'search';

  console.log(user);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);

  const {
    _id: targetUserId,
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

       if (status === 'interested' && globalSocket) {
        globalSocket.emit('sendConnectionRequestNotification', {
          fromUserId: currentUser._id,
          toUserId: userId, 
          firstName: currentUser.firstName,
          lastName: currentUser.lastName
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
     <div className="w-full h-full flex justify-center items-center mt-2 rounded-2xl shadow-2xl">
      <div
        className={`relative min-h-full w-full rounded-3xl shadow-2xl bg-white ring-indigo-200/20 overflow-hidden border border-indigo-100/10 
          ${isSearch ? 'max-w-sm' : 'max-w-md'}`}
      >
        {/* Image Section */}
        <div className={`relative w-full z-10 ${isSearch ? 'aspect-[4/3]' : 'h-full'}`}>
          <img
            src={photoUrl}
            alt={displayName}
            className={"w-full h-full object-cover shadow-md"}
          />
        </div>

        {/* DETAILS */}
        <div className={`flex flex-col ${isSearch ? 'gap-2 p-4' : 'gap-4 p-7'} w-full`}>
          {/* Name and age */}
          <div className="flex items-end gap-3">
            <h1 className={`${isSearch ? 'text-xl' : 'text-2xl'} font-bold text-[#0099CC]`}>{displayName}</h1>
            <span className={`${isSearch ? 'text-md' : 'text-xl'} font-normal text-[#333333]`}>{age || '18'}</span>
          </div>

          {/* Headline & Position */}
          {headline && (
            <div className={`${isSearch ? 'text-md' : 'text-lg'} text-[#333333] leading-tight`}>
              {headline}
            </div>
          )}
          <div className="flex flex-row justify-between">
            {currentPosition && (
              <div className={`${isSearch ? 'text-xs' : 'text-base'} text-[#333333]`}>
                {currentPosition}
              </div>
            )}
            {location && (
              <div className={`${isSearch ? 'text-sm' : 'text-base'} flex items-center text-[#333333] mt-1 gap-1`}>
                <i className="ri-map-pin-2-fill mr-1 text-[#0099CC]"></i> {location}
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, isSearch ? 3 : 6).map((skill, i) => (
                  <span
                    key={i}
                    className={`bg-[#ecf3f7] uppercase text-[#1790a7] ${isSearch ? 'px-2 py-0.5 text-[12px]' : 'px-5 py-2 text-xs'} rounded-md font-semibold shadow-sm whitespace-nowrap`}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > (isSearch ? 3 : 5) && (
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs shadow">
                    +{skills.length - (isSearch ? 3 : 5)} more
                  </span>
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
                className={`${isSearch ? 'text-lg' : 'text-xl'} text-[#374151] hover:text-[#1790a7] transition`}
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
                className={`${isSearch ? 'text-lg' : 'text-xl'} text-[#0077b5] hover:text-[#1790a7] transition`}
              >
                <i className="ri-linkedin-box-fill"></i>
              </a>
            )}
          </div>

          <Link
            to={`/profile/${user._id}`}
            className={`${isSearch ? 'text-xs' : 'text-sm'} text-[#1790a7] font-medium hover:underline mt-1`}
          >
            View Full Profile
          </Link>

          {/* Buttons */}
          {!isSearch && (
             <div className={`flex justify-center ${isSearch ? 'gap-4 mt-auto pt-3' : 'gap-32 mt-4'}`}>
            <button
              className={`${isSearch ? 'w-12 h-12 text-base' : 'w-16 h-16 text-2xl'} rounded-full flex justify-center items-center bg-[#f0f3f7] hover:bg-[#e3eaf6] transition shadow border-2 border-[#e3eaf6]`}
              onClick={() => handleSendRequest('ignored', targetUserId)}
              aria-label="Ignore user"
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              className={`${isSearch ? 'w-12 h-12 text-base' : 'w-16 h-16 text-2xl'} rounded-full flex justify-center items-center bg-[#FF6B6B] text-white font-bold shadow-xl hover:scale-105 active:scale-100 transition-transform`}
              onClick={() => handleSendRequest('interested', targetUserId)}
              aria-label="Connect with user"
            >
              <i className="ri-heart-2-fill"></i>
            </button>
          </div>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default UserCard;
