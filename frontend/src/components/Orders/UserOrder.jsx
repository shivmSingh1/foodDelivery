import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { serverUrl, socket } from '../../App';
import OrdersByShopsCard from './OrdersByShopsCard';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function UserOrder() {

	const [orders, setOrders] = useState({ order: [] })
	const navigate = useNavigate()

	// 🔥 Fetch Orders
	const getUserOrder = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getOrders`, { withCredentials: true })
			setOrders(res?.data?.data)
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		getUserOrder()
	}, [])

	// 🔥 Socket Update
	useEffect(() => {
		const handleUpdate = (data) => {
			if (data.type === "ORDER_STATUS_UPDATED") {
				setOrders(prev => ({
					...prev,
					order: prev.order.map(o =>
						o._id === data.orderId
							? { ...o, status: data.status }
							: o
					)
				}))
			}
		}

		socket.on("order:status:update", handleUpdate)

		return () => {
			socket.off("order:status:update", handleUpdate)
		}
	}, [])

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoMdArrowRoundBack
						size={22}
						style={{ cursor: "pointer" }}
						onClick={() => navigate(-1)}
					/>
					<h5 className="fw-bold m-0">Your Orders</h5>
				</div>

				{/* 🔥 Empty State */}
				{
					orders?.order?.length === 0 && (
						<div className="d-flex justify-content-center mt-5">
							<div
								className="bg-white p-4 text-center"
								style={{
									borderRadius: "12px",
									boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
									maxWidth: "320px",
									width: "100%"
								}}
							>
								<h6 className="mb-2">No orders yet 🍔</h6>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => navigate("/")}
								>
									Order Now
								</button>
							</div>
						</div>
					)
				}

				{/* 🔥 Orders List */}
				{
					orders?.order?.length > 0 && (
						<div className="d-flex flex-column gap-3">

							{orders.order.map((od) => (
								<div key={od._id}>
									<OrdersByShopsCard order={od} />
								</div>
							))}

						</div>
					)
				}

			</div>
		</div>
	)
}

export default UserOrder