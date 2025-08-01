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
    <div 
      className='flex flex-col items-center min-h-screen py-10'
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      }}
    >
      <h1 className='text-[#f97316] text-5xl font-extrabold mb-8 text-center drop-shadow-lg'>
        Connection Requests
      </h1>

      <div className='w-full max-w-5xl px-4'>
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId
          return (
            <div 
              key={_id} 
              className='flex items-center justify-between p-6 w-full bg-[#0f172a] bg-opacity-80 backdrop-blur-sm border-2 border-[#8b5cf6] rounded-2xl shadow-2xl mb-6 hover:border-[#f97316] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]'
            >
              <div className='flex items-center gap-6'>
                <div className='relative'>
                  <img 
                    src={photoUrl} 
                    className='w-20 h-20 rounded-full border-4 border-[#8b5cf6] shadow-lg object-cover' 
                    alt="User" 
                  />
                  <div className='absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center'>
                    <span className='text-white text-xs font-bold'>!</span>
                  </div>
                </div>
                
                <div className='text-left text-white'>
                  <h2 className='text-2xl font-bold text-[#f97316] mb-1'>
                    {firstName + " " + lastName}
                  </h2>
                  <p className='text-lg text-gray-300 mb-2'>
                    {age} • {gender}
                  </p>
                  <p className='italic text-gray-400 text-sm max-w-md leading-relaxed'>
                    {about}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  className="px-6 py-3 bg-[#1e293b] text-white rounded-full shadow-lg border border-gray-600 hover:bg-[#334155] hover:border-gray-500 transition-all duration-300 transform hover:scale-105 font-semibold"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  ❌ Reject
                </button>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-semibold border border-[#8b5cf6] hover:border-[#f97316]"
                  onClick={() => reviewRequest("accepted", request._id)}
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