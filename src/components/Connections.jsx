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
    <div className='flex flex-col items-center bg-white min-h-screen py-10'>
      <h1 className='text-[#FF0099] text-5xl font-extrabold mb-6 '>Your Connections</h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } = connection
        return (
          <div key={_id} className='flex items-center justify-between p-6 w-[50%] bg-white border-2 border-[#FF0099] rounded-lg shadow-lg mb-4'>
            <div className='flex items-center gap-6'>
              <img src={photoUrl} className='w-20 h-20 rounded-full border-4 border-[#FF0099] shadow-md' alt="photo" />
              <div className='text-left text-gray-800'>
                <h2 className='text-2xl font-bold'>{firstName + " " + lastName}</h2>
                <p className='text-lg'>{age}, {gender}</p>
                <p className='italic text-gray-600'>{about}</p>
              </div>
            </div>

            <Link to={"/chat/" + _id}>
              <button className='btn bg-[#FF0099] hover:bg-[#FF3A3A] text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105'>
                Chat 💬
              </button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Connections