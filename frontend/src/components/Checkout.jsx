import React, { useEffect, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Map from './Map';
import { setLocation } from '../redux/mapSlice';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import getCurrentLocation from '../utils/getCurrentLocation';
import getAddress from '../utils/getAddressByLatLng';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';

function Checkout() {

	const { location, address } = useSelector((state) => state.Map)
	const { cart, totalAmount } = useSelector((state) => state.user)

	const [deliveryAddress, setDeliveryAddress] = useState("")
	const [paymentMode, setPaymentMode] = useState('cod')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const deliveryFees = totalAmount > 250 ? "Free" : 40;
	const totalPayableAmount = totalAmount > 250 ? totalAmount : totalAmount + deliveryFees

	useEffect(() => {
		if (address) setDeliveryAddress(address)
	}, [address])

	// 🔥 Location handlers
	const handleSearch = async () => {
		const loc = await getAddress(deliveryAddress)
		if (!loc?.lat || !loc?.long) {
			return toast.error("Invalid address")
		}
		dispatch(setLocation(loc))
	}

	const handleCurrentLocation = async () => {
		const loc = await getCurrentLocation()
		dispatch(setLocation(loc))
		setDeliveryAddress("Current Location Selected")
	}

	// 🔥 Place order
	const handlePlaceOrder = async () => {
		try {
			const payload = {
				paymentMode,
				deliveryAddress: {
					text: deliveryAddress,
					lat: location.lat,
					long: location.long
				},
				totalAmount: totalPayableAmount,
				cart
			}

			const res = await axios.post(`${serverUrl}/order/placeOrder`, payload, { withCredentials: true })

			if (paymentMode === "cod") {
				toast.success(res.data.message)
				navigate("/user-orders")
			} else {
				const orderId = res?.data?.orderId
				const razorOrder = res?.data?.razorOrder
				openRazorpayWindow(orderId, razorOrder)
			}

		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoArrowBack size={22} style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
					<h5 className="fw-bold m-0">Checkout</h5>
				</div>

				<div className="row g-3">

					{/* 📍 LEFT SIDE */}
					<div className="col-12 col-lg-7">

						<div className="bg-white p-3" style={{ borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>

							<h6 className="fw-bold mb-3">
								<FaLocationDot /> Delivery Location
							</h6>

							{/* Address */}
							<div className="d-flex gap-2 mb-3">

								<input
									type="text"
									className="form-control"
									value={deliveryAddress}
									onChange={(e) => setDeliveryAddress(e.target.value)}
									placeholder="Enter address"
								/>

								<button className="btn btn-danger" onClick={handleSearch}>
									<FaSearch />
								</button>

								<button className="btn btn-primary" onClick={handleCurrentLocation}>
									<TbCurrentLocation />
								</button>

							</div>

							{/* Map */}
							<div style={{ height: "200px", borderRadius: "10px", overflow: "hidden" }}>
								{location?.lat && location?.long && (
									<Map location={location} />
								)}
							</div>

						</div>

						{/* 💳 Payment */}
						<div className="bg-white p-3 mt-3" style={{ borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>

							<h6 className="fw-bold mb-3">Payment Method</h6>

							<div className="d-flex gap-2">

								<div
									className={`flex-fill border rounded p-2 ${paymentMode === "cod" ? "bg-warning bg-opacity-25 border-warning" : ""}`}
									style={{ cursor: "pointer" }}
									onClick={() => setPaymentMode("cod")}
								>
									<p className="mb-0 small">Cash on Delivery</p>
								</div>

								<div
									className={`flex-fill border rounded p-2 ${paymentMode === "online" ? "bg-warning bg-opacity-25 border-warning" : ""}`}
									style={{ cursor: "pointer" }}
									onClick={() => setPaymentMode("online")}
								>
									<p className="mb-0 small">Online Payment</p>
								</div>

							</div>

						</div>

					</div>

					{/* 💰 RIGHT SIDE */}
					<div className="col-12 col-lg-5">

						<div className="bg-white p-3" style={{ borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>

							<h6 className="fw-bold mb-3">Order Summary</h6>

							{
								cart.map((c, i) => (
									<div key={i} className="d-flex justify-content-between small mb-1">
										<span>{c.name} × {c.quantity}</span>
										<span>{c.price * c.quantity}</span>
									</div>
								))
							}

							<hr />

							<div className="d-flex justify-content-between small">
								<span>Subtotal</span>
								<span>{totalAmount}</span>
							</div>

							<div className="d-flex justify-content-between small">
								<span>Delivery</span>
								<span>{deliveryFees}</span>
							</div>

							<hr />

							<div className="d-flex justify-content-between fw-bold text-danger">
								<span>Total</span>
								<span>{totalPayableAmount}</span>
							</div>

							<button
								className="btn w-100 mt-3"
								style={{ background: "#FF4D4F", color: "#fff", borderRadius: "10px" }}
								onClick={handlePlaceOrder}
							>
								{paymentMode === "cod" ? "Place Order" : "Pay & Place Order"}
							</button>

						</div>

					</div>

				</div>

			</div>
		</div>
	)
}

export default Checkout