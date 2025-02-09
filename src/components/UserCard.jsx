import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import '../components-css/UserCard.css';

const UserCard = ({ user }) => {
  console.log(user);
  const { _id, firstName, photoUrl, age, about } = user;
  const dispatch = useDispatch();

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
    className="fullscreen w-full h-screen flex justify-center items-center font-[helvetica]"
    style={{
      background: "linear-gradient(135deg, #FF3A3A 0%, #FF0099 100%)",
    }}
  >
    <div className="relative w-[400px] h-[600px] bg-[#1B1B1B] rounded-2xl overflow-hidden shadow-2xl border border-[#FF0099]">
      <div className="imaginecontainer w-full h-full relative">
        <div className="maincard z-[3] w-full absolute h-full">
          <img className="w-full h-full object-cover" src={photoUrl} alt="" />
        </div>

        {/* Neon Overlay */}
        <div
          className="incomingcard z-[2] w-full absolute h-full bg-gradient-to-t from-[#FF3A3A] to-[#FF0099]"
          style={{ top: "0", left: "0", right: "0", bottom: "0", opacity: "0.7" }}
        ></div>
      </div>

      {/* User Details */}
      <div className="absolute top-0 left-0 z-[4] w-full h-full flex flex-col justify-end">
        <div className="detailscontainer w-full bg-black bg-opacity-50 p-5 rounded-b-2xl">
          <div className="details w-full">
            <div className="flex gap-3 text-white">
              <h1 className="font-bold tracking-tighter text-5xl text-[#FFD700]">
                {firstName}
              </h1>
              <h1 className="font-regular tracking-tighter text-5xl opacity-80">
                {age || "18"}
              </h1>
            </div>

            {/* Bio Section */}
            <div className="bio text-white">
              <h3 className="text-lg mt-3 text-[#FFD700]">Bio</h3>
              <p className="text-sm mt-2 opacity-80">{about}</p>
            </div>

            {/* Buttons with Neon Glow */}
            <div className="flex items-start gap-4 mt-6">
              <button
                className="w-1/2 px-3 py-2 rounded-full bg-white text-black text-3xl flex justify-center items-center shadow-lg hover:bg-gray-200 transition-all"
                onClick={() => handleSendRequest("ignored", _id)}
              >
                <i className="ri-close-line"></i>
              </button>
              <button
                className="w-1/2 px-3 py-2 rounded-full bg-[#FC5149] text-white text-3xl flex justify-center items-center shadow-lg hover:bg-[#FF3A3A] transition-all"
                onClick={() => handleSendRequest("interested", _id)}
              >
                <i className="ri-heart-2-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default UserCard;
