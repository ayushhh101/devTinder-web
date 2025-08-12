import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { addConnections } from '../utils/connectionSlice'
import { createSocketConnection } from '../utils/socket'

const Connections = () => {
  const connections = useSelector(state => state.connections)
  const dispatch = useDispatch()
  const [onlineUserIds, setOnlineUserIds] = useState([])
  const user = useSelector(store => store.user)

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
        dispatch(addConnections(res.data.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchConnections()
  }, [])

  useEffect(() => {
    const socket = createSocketConnection()
    socket.emit('setOnline', user._id)

    socket.on('userStatusChanged', ({ userId, status }) => {
      setOnlineUserIds(current =>
        status === "online"
          ? current.includes(userId) ? current : [...current, userId]
          : current.filter(id => id !== userId)
      )
    })

    if (connections && connections.length > 0) {
      connections.forEach(conn => {
        socket.emit('getUserStatus', conn._id)
      })
      socket.on('userStatusResponse', ({ userId, status }) => {
        setOnlineUserIds(current =>
          status === "online"
            ? current.includes(userId) ? current : [...current, userId]
            : current.filter(id => id !== userId)
        )
      })
    }

    return () => socket.disconnect()
  }, [user,connections])

  if (!connections) return null
  if (connections.length === 0) return <div className="min-h-screen flex items-center justify-center font-alibaba text-lg text-textPrimary">No connections</div>

  return (
    <div className='min-h-screen flex flex-col items-center mt-6 bg-white font-alibaba px-4'>
      <div className="w-full max-w-5xl">
        <h1 className="text-[32px] md:text-[48px] font-bold text-textPrimary mb-8 text-center">Your Connections</h1>
        {connections.map(connection => {
          const { _id, firstName, lastName, photoUrl, age, gender, about, headline } = connection
          return (
            <div
              key={_id}
              className="w-full bg-white rounded-2xl border border-lightGray shadow-md px-4 py-5 mb-6 flex flex-col sm:flex-row items-center sm:items-start sm:gap-6 gap-4"
            >
              {/* Avatar + Online Dot */}
              <Link to={`/profile/${_id}`}>
                <div className="relative flex-shrink-0 w-20 h-20 bg-lightGray rounded-full flex items-center justify-center overflow-hidden">
                  <img src={photoUrl} alt={firstName} className="object-cover w-full h-full rounded-full" />
                  {onlineUserIds.includes(_id) && (
                    <span className="absolute bottom-1.5 right-1.5 block w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow"></span>
                  )}
                </div>
              </Link>

              {/* Text Content */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Link to={`/profile/${_id}`} className="hover:underline">
                    <span className="text-lg font-bold text-[#1790a7]">{firstName + " " + lastName}</span>
                  </Link>
                  <span className="text-sm text-gray-400 font-medium">
                    {age ? `• ${age}` : ""} {gender && `• ${gender}`}
                  </span>
                </div>
                {headline && (
                  <div className="text-secondary text-[15px] font-semibold mt-1">{headline}</div>
                )}
                {about && (
                  <div className="text-[15px] text-textPrimary mt-1 leading-normal">{about}</div>
                )}
              </div>
              {/* Chat Button */}
              <div className="flex flex-col gap-2 min-w-max">
                <Link to={`/chat/${_id}`}>
                  <button
                    className="px-5 py-2.5 rounded-[12px] bg-primary text-white font-semibold shadow transition hover:bg-[#15768e] text-sm w-full"
                  >
                    Chat 💬
                  </button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Connections
