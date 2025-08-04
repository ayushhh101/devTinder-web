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
    <div className='flex flex-col items-center min-h-screen py-10 bg-white'>
      <h1 className='text-2xl sm:text-3xl font-extrabold text-[#1e293b] text-center mb-6 w-full max-w-lg'>
        Connection Requests
      </h1>

      <div className='w-full max-w-5xl '>
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, headline, about } = request.fromUserId
          return (
            <div
              key={_id}
              className='bg-white border border-[#e5eaf1] rounded-2xl shadow-sm px-4 py-5 mb-5 flex justify-between items-center'
            >
              <div className='flex-shrink-0 mr-4 flex flex-row gap-2 items-center'>
                <div className='w-14 h-14 rounded-full bg-gray-200 overflow-hidden'>
                  <img
                    src={photoUrl}
                    className='object-cover w-full h-full rounded-full'
                  />
                  {/* <div className='absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center'>
                    <span className='text-white text-xs font-bold'>!</span>
                  </div> */}
                </div>

                <div className='flex-1 mr-2'>
                  <h2 className='text-lg leading-tight font-bold text-[#0099CC] mb-1'>
                    {firstName + " " + lastName}
                  </h2>
                  {headline && (
                    <div className="text-[#313944] font-medium text-[15px] leading-tight mt-0.5 mb-0.5">
                      {headline}
                    </div>
                  )}
                  {about && (
                    <div className="text-[#555d67] text-[15px] leading-[1.4]">
                      {about}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-[#eef2f6] text-[#657084] font-medium rounded-full shadow-none border border-[#e4e7ee] hover:bg-[#e3eaf6] transition text-[15px]"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  ❌ Reject
                </button>
                <button
                  className="px-4 py-2 bg-[#ff6767] text-white font-medium rounded-full shadow-none border border-[#faeded] hover:bg-[#fd4e5c] transition text-[15px]"
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