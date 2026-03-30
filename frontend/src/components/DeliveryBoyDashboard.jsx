import React from 'react'
import Nav from './Nav'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl, socket } from '../App'
import { useState } from 'react'
import AssignmentCard from './deliveryboy/AssignmentCard'
import DeliveryboyTraking from './deliveryboy/DeliveryboyTraking'


function DeliveryBoyDashboard() {
	const { userDetails } = useSelector((state) => state.user)
	const [assignment, setAssignments] = useState([])
	const [currentOrder, setCurrentOrder] = useState(null)
	const [showOtpModal, setShowOtpModal] = useState(false)
	const [otp, setOtp] = useState('')
	const [loading, setLoading] = useState(false)

	const fetchAssignments = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/get-assignment`, { withCredentials: true })
			if (res.status == 200) {
				toast.success("assignment fetched");
				setAssignments(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message)
		}
	}

	const fetchCurrentOrder = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getCurrentOrder`, { withCredentials: true })
			if (res.status === 200) {
				console.log("current order", res)
				setCurrentOrder(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		}
	}

	const requestOtp = async () => {
		try {
			setLoading(true)
			const res = await axios.post(`${serverUrl}/order/send-delivery-otp`, { orderId: currentOrder?._id }, { withCredentials: true })
			if (res.status === 200) {
				toast.success("OTP sent to user's phone");
				setShowOtpModal(true)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		} finally {
			setLoading(false)
		}
	}

	const verifyOtpAndDeliver = async () => {
		try {
			if (!otp.trim()) {
				toast.error("Please enter OTP");
				return;
			}
			setLoading(true)
			const res = await axios.post(`${serverUrl}/order/verify-delivery-otp`, { orderId: currentOrder?._id, otp }, { withCredentials: true })
			if (res.status === 200) {
				toast.success("Order marked as delivered");
				setShowOtpModal(false)
				setOtp('')
				fetchCurrentOrder();
				fetchAssignments();
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCurrentOrder()
		fetchAssignments()
	}, [userDetails])

	useEffect(() => {
		const handleNewAssignment = (data) => {
			console.log(" New Assignment:", data);
			setAssignments(prev => [data, ...prev]);

			toast.success("New delivery assignment received 🚴");
		};

		socket.on("newAssignment", handleNewAssignment);

		return () => {
			socket.off("newAssignment", handleNewAssignment);
		};
	}, []);

	return (
		<div className='container' >
			<Nav isOwner={false} isUser={false} isDeliveryBoy={true} />
			<div className='d-flex align-items-center mt-2 flex-column' >
				<div className='border shadow-md p-3 d-flex align-items-center flex-column w-50' >
					<h5>Welcome {userDetails?.fullname}</h5>
					<p>Lat:{userDetails?.location?.coordinates[1]}&nbsp;Lon:{userDetails?.location?.coordinates[0]}</p>
				</div>
				<div className='border shadow-md p-3 d-flex align-items-center flex-column mt-2 w-50' >
					<h5>Available orders</h5>
					<div className='d-flex flex-column gap-2 p-2' >
						{
							assignment && (
								assignment.map((assign, index) => (
									<AssignmentCard key={index} fetchCurrentOrder={fetchCurrentOrder} assign={assign} />
								))
							)
						}
					</div>
				</div>
				{
					currentOrder && (
						<>
							<div className='border shadow-md p-3 d-flex align-items-center flex-column mt-2 w-50' >
								<h5>Current order</h5>
								<div className='d-flex flex-column gap-2 p-2' >
									<p>{currentOrder?.shopOrder?.shop?.name}</p>
									<p>{currentOrder?.deliveryAddress?.text}</p>
									<p>{currentOrder?.shopOrder?.shopOrderItems?.length} items | {currentOrder.shopOrder?.subTotal}</p>
								</div>
								<div style={{ width: "400px" }} >
									<DeliveryboyTraking currentOrder={currentOrder} />
									<button
										className='btn btn-success w-100 mt-3'
										onClick={requestOtp}
										disabled={loading}
									>
										{loading ? 'Sending OTP...' : 'Mark as Delivered'}
									</button>
								</div>
							</div>

							{showOtpModal && (
								<div className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
									<div className='bg-white p-4 rounded' style={{ width: '400px' }}>
										<h5 className='mb-3'>Enter OTP</h5>
										<p className='text-muted mb-3'>An OTP has been sent to the user. Please ask the user to share it.</p>
										<input
											type='text'
											className='form-control mb-3'
											placeholder='Enter 6-digit OTP'
											value={otp}
											onChange={(e) => setOtp(e.target.value)}
											disabled={loading}
											maxLength='6'
										/>
										<div className='d-flex gap-2'>
											<button
												className='btn btn-secondary flex-grow-1'
												onClick={() => {
													setShowOtpModal(false)
													setOtp('')
												}}
												disabled={loading}
											>
												Cancel
											</button>
											<button
												className='btn btn-success flex-grow-1'
												onClick={verifyOtpAndDeliver}
												disabled={loading}
											>
												{loading ? 'Verifying...' : 'Submit'}
											</button>
										</div>
									</div>
								</div>
							)}
						</>
					)
				}
			</div>
		</div>
	)
}

export default DeliveryBoyDashboard