import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred while loading your feed.';
  } else if (error.request) {
    return 'Network error. Please check your internet connection.';
  } else {
    return 'Unexpected error. Please try again.';
  }
};

const Feed = () => {
  const feed = useSelector(store => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true
      });
      dispatch(addFeed(res.data.data))
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error("Error fetching feed:", msg);
      setError(msg);
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!feed) return

  if (feed.length <= 0) return <h1 className='flex justify-center font-bold'>No users to connect</h1>
  return (
    feed && (
      <div className="flex justify-center my-8 px-4 bg-white">
        <div className="w-full max-w-md">
          <UserCard user={feed[0]} />
        </div>
      </div>
    )
  )
}

export default Feed