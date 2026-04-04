import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl, socket } from '../App'
import AssignmentCard from './deliveryboy/AssignmentCard'
import DeliveryboyTraking from './deliveryboy/DeliveryboyTraking'
import { useLoader } from '../customHooks/useLoader';

function DeliveryBoyDashboard() {

	const { userDetails } = useSelector((state) => state.user)

	const [assignment, setAssignments] = useState([])
	const [currentOrder, setCurrentOrder] = useState(null)
	const [showOtpModal, setShowOtpModal] = useState(false)
	const [otp, setOtp] = useState('')
	const [loading, setLoading] = useState(false)
	const { showLoader, hideLoader } = useLoader()

	// 🔥 Fetch Assignments
	const fetchAssignments = async () => {
		try {
			showLoader('Loading orders...')
			const res = await axios.get(`${serverUrl}/order/get-assignment`, { withCredentials: true })
			if (res.status === 200) {
				setAssignments(res.data.data)
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			hideLoader()
		}
	}

	// 🔥 Fetch Current Order
	const fetchCurrentOrder = async () => {
		try {
			showLoader('Loading order...')
			const res = await axios.get(`${serverUrl}/order/getCurrentOrder`, { withCredentials: true })
			if (res.status === 200) {
				setCurrentOrder(res.data.data)
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			hideLoader()
		}
	}

	// 🔥 OTP
	const requestOtp = async () => {
		try {
			setLoading(true)
			showLoader('Sending OTP...')
			await axios.post(`${serverUrl}/order/send-delivery-otp`, { orderId: currentOrder?._id }, { withCredentials: true })
			setShowOtpModal(true)
			toast.success("OTP sent")
		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			setLoading(false)
			hideLoader()
		}
	}

	const verifyOtpAndDeliver = async () => {
		try {
			if (!otp.trim()) return toast.error("Enter OTP")

			setLoading(true)
			showLoader('Verifying OTP...')

			await axios.post(`${serverUrl}/order/verify-delivery-otp`,
				{ orderId: currentOrder?._id, otp },
				{ withCredentials: true }
			)

			toast.success("Delivered ✅")
			setShowOtpModal(false)
			setOtp("")
			fetchCurrentOrder()
			fetchAssignments()

		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			setLoading(false)
			hideLoader()
		}
	}

	useEffect(() => {
		fetchCurrentOrder()
		fetchAssignments()
	}, [userDetails])

	useEffect(() => {
		socket.on("newAssignment", (data) => {
			setAssignments(prev => [data, ...prev])
			toast.success("New Order 🚴")
		})
		return () => socket.off("newAssignment")
	}, [])

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<Nav isDeliveryBoy={true} />

			<div className="container py-3">

				{/* 🔥 Profile */}
				<div className="bg-white p-3 rounded shadow-sm mb-3 text-center">
					<h6 className="fw-bold mb-1">Welcome {userDetails?.fullname}</h6>
					<p className="small text-muted mb-0">
						📍 {userDetails?.location?.coordinates?.[1]}, {userDetails?.location?.coordinates?.[0]}
					</p>
				</div>

				{/* 🔥 Assignments */}
				<div className="bg-white p-3 rounded shadow-sm mb-3">

					<h6 className="fw-bold mb-2">Available Orders</h6>

					{
						assignment.length === 0 && (
							<p className="small text-muted">No orders available</p>
						)
					}

					<div className="d-flex flex-column gap-2">
						{assignment.map((assign, i) => (
							<AssignmentCard key={i} assign={assign} fetchCurrentOrder={fetchCurrentOrder} />
						))}
					</div>

				</div>

				{/* 🔥 Current Order */}
				{
					currentOrder && (
						<div className="bg-white p-3 rounded shadow-sm">

							<h6 className="fw-bold mb-2">Current Order</h6>

							<div className="small mb-2">
								<p className="mb-1"><b>{currentOrder?.shopOrder?.shop?.name}</b></p>
								<p className="mb-1 text-muted">{currentOrder?.deliveryAddress?.text}</p>
								<p className="mb-0 text-muted">
									{currentOrder?.shopOrder?.shopOrderItems?.length} items • ₹{currentOrder?.shopOrder?.subTotal}
								</p>
							</div>

							<div style={{ height: "250px" }}>
								<DeliveryboyTraking currentOrder={currentOrder} />
							</div>

							<button
								className="btn w-100 mt-3"
								style={{
									background: "#FF4D4F",
									color: "#fff",
									borderRadius: "10px"
								}}
								onClick={requestOtp}
								disabled={loading}
							>
								{loading ? "Sending OTP..." : "Mark as Delivered"}
							</button>

						</div>
					)
				}

			</div>

			{/* 🔥 OTP MODAL */}
			{
				showOtpModal && (
					<div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
						style={{ background: "rgba(0,0,0,0.5)", zIndex: 999 }}
					>
						<div className="bg-white p-4 rounded" style={{ width: "320px" }}>

							<h6 className="fw-bold mb-2">Enter OTP</h6>
							<p className="small text-muted mb-3">Ask customer for OTP</p>

							<input
								className="form-control mb-3"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								maxLength={6}
							/>

							<div className="d-flex gap-2">
								<button className="btn btn-light w-50"
									onClick={() => setShowOtpModal(false)}>
									Cancel
								</button>

								<button
									className="btn w-50"
									style={{ background: "#FF4D4F", color: "#fff" }}
									onClick={verifyOtpAndDeliver}
								>
									Submit
								</button>
							</div>

						</div>
					</div>
				)
			}

		</div>
	)
}

export default DeliveryBoyDashboard