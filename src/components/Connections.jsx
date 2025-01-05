import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'

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
    <div className='flex flex-col justify-center'>
      <h1 className='flex justify-center text-bold text-5xl my-4'>Connections</h1>

      {connections.map((connection) => {
        const { _id , firstName, lastName, photoUrl, age, gender, about } = connection
        return (
          <div key={_id}>
            <div key={_id} className='flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto my-2'>
              <div>
                <img src={photoUrl} className='w-20 h-20 rounded-full' alt="photo" />
              </div>
              <div className='text-left mx-4'>
                <h2 className='font-bold'>
                  {firstName + " " + lastName}
                </h2>
                <p>{age + "," + gender}</p>
                <p>{about}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Connections