import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import '../components-css/Navbar.css'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const user = useSelector(store => store.user)
  const userData = useSelector(store => store.user._id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = useSelector(
    state => state.notifications.filter(n => !n.read).length
  );

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, {
        withCredentials: true
      });
      dispatch(removeUser());
      return navigate('/login');
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#0099CC] border-b border-[#c8e6ed] shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* logo */}
        <Link
          to="/feed"
          className="text-2xl font-bold text-white tracking-tight hover:text-secondary transition duration-200"
        >
          DevTinder
        </Link>

        {/* hamburger menu*/}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <XMarkIcon className="h-7 w-7 text-white" />
            : <Bars3Icon className="h-7 w-7 text-white" />
          }
        </button>

        {/* desktop links */}
        {userData && (
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-[#eefcf9] whitespace-nowrap">
              Welcome, <span className="text-white font-semibold">{user.firstName}</span>
            </span>

            {/* avatar Menu */}
            <div className="relative" ref={dropdownRef}>
              <button className="btn btn-ghost btn-circle avatar p-0 hover:bg-white/10 transition"
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}>
                <div className="w-10 h-10 rounded-full border-2 border-[#c8e6ed] hover:border-secondary transition">
                  <img
                    alt="User Avatar"
                    src={user.photoUrl}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              </button>

              {avatarMenuOpen && (
              <ul className="absolute right-0 mt-0 w-48 bg-white border border-[#c8e6ed] rounded-xl shadow-2xl p-2.5 z-50 space-y-2">
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="hover:bg-[#f3f7fa] hover:text-[#21d8d8] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
                  >
                    Connections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
                  >
                    Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
                  >
                    Search Profiles
                  </Link>
                </li>
                <li className="relative">
                  <Link to="/notifications" className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-xl px-3 py-2.5 text-sm font-medium text-[#147687]">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute ml-2 bg-red-500 text-white text-xs px-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left hover:bg-red-100 hover:text-red-500 transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
                  >
                    Logout
                  </button>
                </li>
              </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* mobile menu */}
      {userData && menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-white rounded-xl border border-[#c8e6ed] shadow-xl p-4 flex flex-col gap-2">
            <span className="text-sm font-medium text-[#11778a] mb-2">
              Welcome, <span className="text-[#17b3c9] font-semibold">{user.firstName}</span>
            </span>
            <Link
              to="/profile"
              className="flex justify-between items-center hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
              onClick={() => setMenuOpen(false)}
            >
              Profile
              <span className="bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                New
              </span>
            </Link>
            <Link
              to="/connections"
              className="hover:bg-[#f3f7fa] hover:text-[#21d8d8] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
              onClick={() => setMenuOpen(false)}
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
              onClick={() => setMenuOpen(false)}
            >
              Requests
            </Link>
            <Link
              to="/search"
              className="hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
              onClick={() => setMenuOpen(false)}
            >
              Search Profiles
            </Link>
            <Link
              to="/notifications"
              className="flex justify-between items-center hover:bg-[#e5faff] hover:text-[#17b3c9] transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687] relative"
              onClick={() => setMenuOpen(false)}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute ml-24 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left hover:bg-red-100 hover:text-red-500 transition rounded-lg px-3 py-2.5 text-sm font-medium text-[#147687]"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar