import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./Body"
import Login from "./Login"
import Profile from "./Profile"

function App() {

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          {/* Parent Route */}
          <Route path="/" element={<Body />}>
            {/* Children Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
