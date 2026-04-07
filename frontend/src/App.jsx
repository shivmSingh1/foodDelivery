import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import useCurrentUser from './customHooks/useCurrentUser';
import Home from './pages/Home';
import { useDispatch, useSelector } from 'react-redux';
import UseCurrentCity from './customHooks/UseCurrentCity';
import CreateEditShop from './components/CreateEditShop';
import AddItems from './components/AddItems';
import Cart from './components/Cart';
import { useEffect } from 'react';
import { cartTotalAmount, setSocket } from './redux/userSlice';
import Checkout from './components/Checkout';
import UserOrder from './components/Orders/UserOrder';
import OwnerOrderCard from './components/Orders/OwnerOrderCard';
import UseUpdateLocation from './customHooks/UseUpdateLocation';
import UserTrackOrder from './components/Orders/UserTrackOrder';
import ShopItemsPage from './components/ShopItemsPage';
import { io, Socket } from 'socket.io-client';
import CompleteProfile from './pages/CompleteProfile';
import LoaderSpinner from './components/Spinner';
import Footer from './components/Footer';
import PhoneAuth from './pages/PhoneAuth';
export const serverUrl = "http://fooddelivery-t5vz.onrender.com/api"

export const socket = io("https://fooddelivery-t5vz.onrender.com");

function App() {
  useCurrentUser()
  UseUpdateLocation()
  UseCurrentCity()
  const { userDetails, cart } = useSelector(state => state.user)
  const dispatch = useDispatch()

  // test

  useEffect(() => {
    if (cart) {
      dispatch(cartTotalAmount())
    }
  }, [cart])

  useEffect(() => {
    if (!userDetails?._id) return;

    if (socket.connected) {
      console.log("⚡ Already Connected:", socket.id);
      socket.emit("identity", { userId: userDetails._id });
    }

    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("identity", { userId: userDetails._id });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [userDetails?._id])

  return (
    <>
      <LoaderSpinner />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path='/' element={userDetails ? <Home /> : <Navigate to={"/signin"} />} />
            <Route path='/signup' element={!userDetails ? <Signup /> : <Navigate to={"/"} />} />
            <Route path="/signin" element={!userDetails ? <Signin /> : <Navigate to={"/"} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-edit-shop" element={<CreateEditShop />} />
            <Route path="/add-item" element={<AddItems />} />
            <Route path="/add-item/:id" element={<AddItems />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/user-orders" element={<UserOrder />} />
            <Route path="/owner-orders" element={<OwnerOrderCard />} />
            <Route path="/track-order/:orderId" element={<UserTrackOrder />} />
            <Route path="/shop/:shopId" element={<ShopItemsPage />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/auth-phone" element={<PhoneAuth />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
