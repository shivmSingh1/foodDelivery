import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import useCurrentUser from './customHooks/useCurrentUser';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
export const serverUrl = "http://localhost:5000/api"

function App() {
  useCurrentUser()
  const userData = useSelector(state => state.user)
  console.log(userData, "dsfds")
  return (
    <>
      <Routes>
        <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
        <Route path='/signup' element={!userData ? <Signup /> : <Navigate to={"/"} />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to={"/"} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
