import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import '../components-css/Navbar.css'

const Navbar = () => {

  const user = useSelector(store => store.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
      await axios.post(`${BASE_URL}/logout`,{}, {
        withCredentials: true
      });
      dispatch(removeUser());
      return navigate('/login');
    } catch (error) {
      console.log(error)
    }
  }
  return (  
    <div className="navbar bg-gradient-to-r from-[#FF3A3A] to-[#FF0099] shadow-lg px-6 border-b-4 border-white">
      <div className="flex-1">
        <Link
          to="/feed"
          className="text-3xl font-bold text-white tracking-wide neon-text hover:text-[#FFD700] transition duration-300"
        >
          DevTinder 
        </Link>
      </div>

      {user && (
        <div className="flex-none flex items-center gap-6">
          <p className="text-lg font-semibold text-white">Welcome, {user.firstName}</p>

          <div className="dropdown dropdown-end relative">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border-2 border-white shadow-lg shadow-[#FF0099] transition duration-300 hover:shadow-[#FFD700]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#FFD700]">
                <img
                  alt="User Avatar"
                  src={user.photoUrl}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm bg-[#1B1B1B] text-white border border-[#FF3A3A] shadow-lg shadow-[#FF0099] rounded-lg mt-3 w-52 p-2 z-50 relative"
            >
              <li>
                <Link to="/profile" className="flex justify-between hover:bg-[#FF0099] hover:text-white transition rounded-md px-3 py-2">
                  Profile <span className="badge bg-[#FFD700] text-black">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="hover:bg-[#FF3A3A] hover:text-white transition rounded-md px-3 py-2">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:bg-[#FF3A3A] hover:text-white transition rounded-md px-3 py-2">
                  Requests
                </Link>
              </li>
              <li>
                <a onClick={handleLogout} className="hover:bg-[#FF0099] hover:text-white transition rounded-md px-3 py-2">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar