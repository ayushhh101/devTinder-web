import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestSlice'

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector(state => state.requests)

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
    <div className='flex flex-col justify-center'>
      <h1 className='flex justify-center text-bold text-5xl my-4'>Requests</h1>

      {requests.map((requests) => {
        const { _id ,firstName, lastName, photoUrl, age, gender, about } = requests.fromUserId
        return (
          <div key={_id}>
            <div className='flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto my-2'>
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
              <div>
              <button className="btn btn-primary mx-2">Reject</button>
              <button className="btn btn-secondary">Accept</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Requests