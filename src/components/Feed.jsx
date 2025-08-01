import axios from 'axios';
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector(store => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if(feed) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true
      });
      dispatch(addFeed(res.data))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  if(!feed) return

  if(feed.length <= 0) return <h1 className='flex justify-center font-bold'>No users to connect</h1>
  return (
  feed &&(
    <div className="flex justify-center my-8 px-4">
      <div className="w-full max-w-md">
        <UserCard user={feed[0]} />
      </div>
    </div>
  )
)
}

export default Feed