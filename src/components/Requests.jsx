import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector(state => state.requests)

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {},
        { withCredentials: true })
        dispatch(removeRequest(_id))
        
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
      console.log(res)
      dispatch(addRequests(res.data.data))

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (!requests) {
    return
  }

  if (requests.length === 0) {
    return <div>No Requests</div>
  }

  return (
    <div className='flex flex-col items-center bg-white min-h-screen py-10'>
      <h1 className='text-[#FF0099] text-5xl font-extrabold mb-6'>Connection Requests</h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId
        return (
          <div key={_id} className='flex items-center justify-between p-6 w-[65%] bg-white border-2 border-[#FF0099] rounded-lg shadow-lg mb-4'>
            <div className='flex items-center gap-6'>
              <img src={photoUrl} className='w-20 h-20 rounded-full border-4 border-[#FF0099] shadow-md' alt="User" />
              <div className='text-left text-gray-800'>
                <h2 className='text-2xl font-bold'>{firstName + " " + lastName}</h2>
                <p className='text-lg'>{age}, {gender}</p>
                <p className='italic text-gray-600'>{about}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
                onClick={() => reviewRequest("rejected", request._id)}>
                ❌ Reject
              </button>
              <button 
                className="px-5 py-2 bg-[#FF0099] text-white rounded-lg shadow-lg hover:bg-[#FF3A3A] transition transform hover:scale-105"
                onClick={() => reviewRequest("accepted", request._id)}>
                ✅ Accept
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Requests