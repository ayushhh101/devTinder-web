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
    <div className="fullscreen w-full h-screen flex justify-center items-center font-[helvetica]" style={{
      background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)"
    }}>
      <div className="relative w-[400px] h-[600px] bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="imaginecontainer w-full h-full relative">
          <div className="maincard z-[3] w-full absolute h-full">
            <img className="w-full h-full object-cover" src={photoUrl} alt="" />
          </div>
          {/* Ensure the incoming card overlaps the navbar */}
          <div className="incomingcard z-[2] w-full absolute h-full bg-gradient-to-t from-[#ff758c] to-[#ff7eb3]" style={{
            top: "0", left: "0", right: "0", bottom: "0"
          }}></div>
        </div>
        <div className="absolute top-0 left-0 z-[4] w-full h-full flex flex-col justify-between">
          <div className="navbar px-5 py-3 flex justify-between items-center text-white z-[5]">
            <h3 className="text-xl font-medium tracking-tight">They Liked You!</h3>
          </div>
          <div className="detailscontainer w-full">
            <div className="details px-5 py-3 w-full">
              <div className="flex gap-3 text-white mt-1">
                <h1 className="font-regular tracking-tighter text-5xl">{firstName}</h1>
                <h1 className="font-regular tracking-tighter text-5xl opacity-60">{age || '18'}</h1>
              </div>
              <div className="bio text-white">
                <h3 className="text-lg mt-3">Bio</h3>
                <p className="text-sm mt-2">{about}</p>
              </div>
              <div className="flex items-start gap-2 mt-6">
                <button className="px-3 rounded-full w-1/2 bg-white" onClick={() => handleSendRequest("ignored", _id)}>
                  <i className="deny text-3xl ri-close-line"></i>
                </button>
                <button className="px-3 rounded-full w-1/2 bg-[#FC5149]" onClick={() => handleSendRequest("interested", _id)}>
                  <i className="accept text-3xl text-white ri-heart-2-fill"></i>
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
