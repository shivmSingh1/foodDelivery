import React, { useEffect, useState } from 'react'
import { serverUrl, socket } from '../../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import OrderCard from './OrderCard'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'

function OwnerOrderCard() {

	const [myOrders, setMyOrders] = useState([])
	const navigate = useNavigate()

	// 🔥 Fetch Orders
	const getOwnerOrders = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getOwnerOrder`, { withCredentials: true })
			if (res.status === 200) {
				setMyOrders(res.data.data)
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		getOwnerOrders()
	}, [])

	// 🔥 Real-time Orders
	useEffect(() => {
		socket.on("newOrder", (data) => {
			setMyOrders(prev => [data, ...prev])
		})

		return () => socket.off("newOrder")
	}, [])

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center justify-content-between mb-3">

					<div className="d-flex align-items-center gap-3">
						<IoMdArrowRoundBack
							size={22}
							style={{ cursor: "pointer" }}
							onClick={() => navigate(-1)}
						/>
						<h5 className="fw-bold m-0">My Orders</h5>
					</div>

					{/* 🔥 Order Count */}
					<span
						className="px-3 py-1 small"
						style={{
							background: "#FFE5E5",
							color: "#FF4D4F",
							borderRadius: "20px"
						}}
					>
						{myOrders.length} Orders
					</span>

				</div>

				{/* 🔥 Empty State */}
				{
					myOrders.length === 0 && (
						<div className="d-flex justify-content-center mt-5">

							<div
								className="bg-white text-center p-4"
								style={{
									borderRadius: "14px",
									boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
									maxWidth: "350px",
									width: "100%"
								}}
							>
								<h6 className="fw-bold mb-2">No Orders Yet 📦</h6>
								<p className="text-muted small">
									New orders will appear here automatically.
								</p>
							</div>

						</div>
					)
				}

				{/* 🔥 Orders List */}
				{
					myOrders.length > 0 && (
						<div className="d-flex flex-column gap-3">

							{myOrders.map((order, idx) => (
								<div key={idx}>
									<OrderCard order={order} />
								</div>
							))}

						</div>
					)
				}

			</div>
		</div>
	)
}

export default OwnerOrderCard