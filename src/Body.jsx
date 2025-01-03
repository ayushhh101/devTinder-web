import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {
  return (
    <> 
    <Navbar />
    {/* Any children routes of body will be rendered here (in outlet) below navbar*/}
    <Outlet />
    <Footer />
    </>
  )
}

export default Body