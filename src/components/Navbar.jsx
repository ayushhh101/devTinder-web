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
    <div className="navbar bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-500/30 shadow-xl px-6 py-4">
      <div className="flex-1">
        <Link
          to="/feed"
          className="text-2xl font-bold text-white tracking-tight hover:text-orange-300 transition duration-200"
        >
          DevTinder
        </Link>
      </div>

      {user && (
        <div className="flex-none flex items-center gap-6">
          <p className="text-sm font-medium text-indigo-100">
            Welcome, <span className="text-white font-semibold">{user.firstName}</span>
          </p>

          <div className="dropdown dropdown-end relative">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar p-0 hover:bg-white/10 transition duration-200"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white/30 hover:border-orange-400 transition duration-200">
                <img
                  alt="User Avatar"
                  src={user.photoUrl}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-slate-800 border border-indigo-500/30 rounded-xl shadow-2xl mt-2 w-48 p-2 z-50"
            >
              <li>
                <Link 
                  to="/profile" 
                  className="flex justify-between items-center hover:bg-indigo-600/20 hover:text-indigo-300 transition duration-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"
                >
                  Profile 
                  <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/connections" 
                  className="hover:bg-purple-600/20 hover:text-purple-300 transition duration-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link 
                  to="/requests" 
                  className="hover:bg-indigo-600/20 hover:text-indigo-300 transition duration-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"
                >
                  Requests
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left hover:bg-red-500/20 hover:text-red-300 transition duration-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar