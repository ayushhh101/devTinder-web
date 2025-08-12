import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import Chat from "./components/Chat"
import './App.css'
import ProfileSearch from "./components/ProfileSearch"
import FullProfilePage from "./components/FullProfilePage"
import NotificationListener from "./components/NotificationListener"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationCenter from "./components/NotificationCenter"

function App() {

  return (
    <>
      <Provider store={appStore}>
        <NotificationListener />
        <ToastContainer position="top-right" autoClose={4000} />
        <BrowserRouter basename="/">
          <Routes>
            {/* Parent Route */}
            <Route path="/" element={<Body />}>
              {/* Children Routes */}
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/search" element={<ProfileSearch />} />
              <Route path="/profile/:userId" element={<FullProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
