import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  console.log(user)
  const { _id, firstName, lastName, photoUrl, gender, age, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {},
        { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoUrl}
          alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{age + "," + gender}</p>
        <p>{about}</p>
        <div className="card-actions justify-center my-4 gap-40">
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}>
            Interested
          </button>
          <button 
          className="btn btn-primary"
          onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
            </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard