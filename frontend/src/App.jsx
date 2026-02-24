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
import UseCurrentCity from './customHooks/UseCurrentCity';
import CreateEditShop from './components/CreateEditShop';
import AddItems from './components/AddItems';
export const serverUrl = "http://localhost:5000/api"

function App() {
  useCurrentUser()
  UseCurrentCity()
  const { userDetails } = useSelector(state => state.user)
  return (
    <>
      <Routes>
        <Route path='/' element={userDetails ? <Home /> : <Navigate to={"/signin"} />} />
        <Route path='/signup' element={!userDetails ? <Signup /> : <Navigate to={"/"} />} />
        <Route path="/signin" element={!userDetails ? <Signin /> : <Navigate to={"/"} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-edit-shop" element={<CreateEditShop />} />
        <Route path="/add-item" element={<AddItems />} />
        <Route path="/add-item/:id" element={<AddItems />} />
      </Routes>
    </>
  )
}

export default App
