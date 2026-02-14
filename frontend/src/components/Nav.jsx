import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';

function Nav() {
	const { userDetails } = useSelector(state => state.user)
	const [showLogoutBox, setShowLogoutBox] = useState(false)
	return (
		<div className='container' >
			<div className='d-flex justify-content-center gap-3 p-2'>
				<h5>FoodDelivery</h5>
				<div className='d-flex gap-2 border' >
					<div className='d-flex  justify-content-center align-items-center' >
						<FaLocationDot size={15} />
						Jhanshi
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
							<p className='text-danger' >Logout</p>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Nav