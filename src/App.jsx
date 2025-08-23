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
import ProtectedRoute from "./utils/ProtectedRoute"
import Navbar from "./components/Navbar"

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
            <Route path="/login" element={<Login />} />
              {/* Children Routes */}
              <Route path="/notifications"
                element={<ProtectedRoute>
                  <NotificationCenter />
                </ProtectedRoute>} />
              <Route path="/feed"  element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } />
              <Route path="/profile"  element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              <Route path="/connections" element={
                  <ProtectedRoute>
                    <Connections />
                  </ProtectedRoute>
                } />
              <Route path="/requests" element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }/>
              <Route path="/chat/:targetUserId"  element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
              <Route path="/search"  element={
                  <ProtectedRoute>
                    <ProfileSearch />
                  </ProtectedRoute>
                } />
              <Route path="/profile/:userId" element={
                  <ProtectedRoute>
                    <FullProfilePage />
                  </ProtectedRoute>
                } />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
