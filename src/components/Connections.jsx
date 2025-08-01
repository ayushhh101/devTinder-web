import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
import { Link } from 'react-router-dom'

const Connections = () => {
  const connections = useSelector(state => state.connections)
  const dispatch = useDispatch()

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
      console.log(res.data.data)
      dispatch(addConnections(res.data.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  if (!connections) {
    return
  }

  if (connections.length === 0) {
    return <div>No connections</div>
  }

  return (
   <div 
      className='flex flex-col items-center min-h-screen py-10'
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      }}
    >
      <h1 className='text-[#f97316] text-5xl font-extrabold mb-8 text-center drop-shadow-lg'>
        Your Connections
      </h1>

      <div className='w-full max-w-4xl px-4'>
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection
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
                    alt="photo" 
                  />
                  <div className='absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0f172a]'></div>
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

              <Link to={"/chat/" + _id}>
                <button className='bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-semibold border border-[#8b5cf6] hover:border-[#f97316]'>
                  Chat 💬
                </button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Connections