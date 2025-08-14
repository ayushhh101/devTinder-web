import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'
import { globalSocket } from './NotificationListener';
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../utils/errorHandler';

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector(state => state.requests)
  const user = useSelector(state => state.user);

  const reviewRequest = async (status, request) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/review/${status}/${request._id}`, {},
        { withCredentials: true })
      dispatch(removeRequest(request._id))

      if (status === 'accepted' && globalSocket) {
        globalSocket.emit('sendConnectionAcceptedNotification', {
          fromUserId: user._id,
          toUserId: request.fromUserId._id,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
      console.log(res)
    } catch (error) {
      const msg = getErrorMessage(error);
      alert(msg); // Replace with toast/snackbar for better UX
      console.error("Review request failed:", msg);
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
      console.log(res)
      dispatch(addRequests(res.data.data))

    } catch (error) {
      const msg = getErrorMessage(error);
      alert(msg);
      console.error("Fetching requests failed:", msg);
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (!requests) return null

  if (requests.length === 0) return <div className="min-h-screen flex items-center justify-center text-lg text-textPrimary font-alibaba">No Requests</div>

  return (
    <div className='flex flex-col items-center min-h-screen py-10 bg-white font-alibaba px-4'>
      <h1 className='text-[32px] md:text-[48px] font-bold text-textPrimary mb-8 text-center'>
        Connection Requests
      </h1>

      <div className='w-full max-w-5xl space-y-5'>
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, headline, about } = request.fromUserId
          return (
            <div
              key={_id}
              className='bg-white border border-lightGray rounded-2xl shadow-sm px-4 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
            >
              {/* Left: Avatar and Info */}
              <div className="flex flex-col sm:flex-row items-center flex-1 gap-4">
                <Link to={`/profile/${_id}`}>
                  <div className="w-14 h-14 rounded-full bg-lightGray overflow-hidden">
                    <img
                      src={photoUrl}
                      className='object-cover w-full h-full rounded-full'
                    />
                  </div>
                </Link>

                <div className='text-center sm:text-left'>
                  <h2 className='text-lg leading-tight font-bold text-primary'>
                    {firstName + " " + lastName}
                  </h2>
                  {headline && (
                    <div className="text-h3 font-medium text-[15px] mt-0.5 mb-0.5">
                      {headline}
                    </div>
                  )}
                  {about && (
                    <div className="text-textPrimary text-[15px] leading-[1.4]">
                      {about}
                    </div>
                  )}
                  {(age || gender) && (
                    <div className="text-sm text-gray-500 mt-0.5">
                      {age && age} {gender && `• ${gender}`}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-center sm:justify-end w-full sm:w-auto">
                <button
                  className="px-4 py-2 bg-lightGray text-[#657084] font-medium rounded-[12px] border border-lightGray hover:bg-gray-200 transition text-[15px]"
                  onClick={() => reviewRequest("rejected", request)}
                >
                  ❌ Reject
                </button>
                <button
                  className="px-4 py-2 bg-secondary text-white font-medium rounded-[12px] hover:bg-[#fd4e5c] transition text-[15px]"
                  onClick={() => reviewRequest("accepted", request)}
                >
                  ✅ Accept
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Requests