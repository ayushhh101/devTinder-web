import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const fetchUser = async () => {
    // if(userData) return;
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if(error.status === 401){
      navigate('/login');
      }
      console.log(error)
    }
  };

  useEffect(() => {
    fetchUser();
  }, [])
  return (
    <>
      <Navbar />
      {/* Any children routes of body will be rendered here (in outlet) below navbar*/}
      <Outlet />
      {/* <Footer /> */}
    </>
  )
}

export default Body