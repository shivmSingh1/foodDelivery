import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserDetails } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav() {
	const { userDetails } = useSelector(state => state.user)
	const { city } = useSelector(state => state.user)
	const [showLogoutBox, setShowLogoutBox] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			console.log("here")
			const res = await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true })
			if (res.status === 200) {
				dispatch(setUserDetails(null))
				navigate("/signin")
			}
		} catch (error) {
			console.log(error.message, "logout error")
		}
	}

	return (
		<div className='container' >
			<div className='d-flex justify-content-center gap-3 p-2'>
				<h5>FoodDelivery</h5>
				<div className='d-flex gap-2 border' >
					<div className='d-flex  justify-content-center align-items-center' >
						<FaLocationDot size={15} />
						{city && city}
					</div>
					<div className='d-flex  justify-content-center align-items-center' >
						<div className='ps-2 pe-2'><IoSearchSharp size={15} /></div>
						<input type="text" name='search' />
					</div>
				</div>
				<div className='d-flex gap-2  justify-content-center align-items-center' >
					<span className='me-2' >
						<span className='position-relative' ><CiShoppingCart size={30} /></span>
						<span className='position-absolute top-0' ><small>0</small></span>
					</span>
					<span className='p-1 border ' >
						my orders
					</span>
					<div>
						<span className='rounded-circle border px-3 py-1 d-flex justify-content-center align-items-center position-relative' onClick={() => setShowLogoutBox(!showLogoutBox)} style={{ cursor: "pointer" }} >
							{userDetails?.fullname?.toString().slice(0, 1).toUpperCase()}
						</span>
						<span className={`position-absolute border p-2 mt-2 ${showLogoutBox ? "d-block" : "d-none"}`}  >
							{userDetails?.fullname?.toString()}
							<p className='text-danger' style={{ cursor: 'pointer' }} onClick={() => handleLogout()}  >Logout</p>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Nav