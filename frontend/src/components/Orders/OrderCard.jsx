import React, { useState } from 'react'
import OrderItemsCard from './OrderItemsCard'
import Select from 'react-select'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl } from '../../App'

function OrderCard({ order }) {

	const [status, setStatus] = useState({
		value: order?.status,
		label: order?.status
	})

	const [availableBoys, setAvailableBoys] = useState([])

	const options = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'preparing', label: 'Preparing' },
		{ value: "out for delivery", label: 'Out For Delivery' },
		{ value: 'delivered', label: 'Delivered' }
	]

	// 🔥 Update Status
	const setOrderStatus = async (value) => {
		try {
			const res = await axios.post(
				`${serverUrl}/order/updateOrderStatus`,
				{
					status: value,
					orderId: order._id,
					shopId: order?.shopOrder?.[0]?.shop?._id || order?.shopOrder?.[0]?.shop
				},
				{ withCredentials: true }
			)

			if (res.status === 200) {
				toast.success(res.data.message)
				setAvailableBoys(res?.data?.data?.availableBoys || [])
			}

		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	const handleStatusChange = (e) => {
		setStatus(e)
		setOrderStatus(e.value)
	}

	return (
		<div
			className="bg-white p-3 p-md-4"
			style={{
				borderRadius: "14px",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
			}}
		>

			{/* 🔥 Top Section */}
			<div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">

				<div>
					<h6 className="fw-bold mb-1">
						{order?.user?.fullname}
					</h6>

					<p className="mb-0 small text-muted">
						{order?.user?.email}
					</p>

					<p className="mb-0 small text-muted">
						{order?.user?.mobile}
					</p>
				</div>

				{/* 🔥 Status Badge */}
				<span
					className="px-3 py-1 small align-self-start"
					style={{
						background: "#FFE5E5",
						color: "#FF4D4F",
						borderRadius: "20px"
					}}
				>
					{status?.value}
				</span>

			</div>

			{/* 🔥 Payment */}
			<div className="mb-2 small">
				<p className="mb-1">
					Payment: {order?.paymentMethod}
				</p>

				{order?.paymentMethod !== "cod" && (
					<p className="mb-1">
						Status: {order?.payment ? "Paid" : "Pending"}
					</p>
				)}
			</div>

			{/* 🔥 Address */}
			<p className="small text-muted mb-3">
				📍 {order?.deliveryAddress?.text}
			</p>

			{/* 🔥 Items */}
			<div className="d-flex flex-column gap-2 mb-3">
				{order?.shopOrder?.[0]?.shopOrderItems?.map((item, idx) => (
					<OrderItemsCard key={idx} item={item} />
				))}
			</div>

			{/* 🔥 Status Control */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-2">

				<p className="fw-semibold mb-0">
					Update Status
				</p>

				<div style={{ width: "100%", maxWidth: "250px" }}>
					<Select
						options={options}
						value={status}
						onChange={handleStatusChange}
					/>
				</div>

			</div>

			{/* 🔥 Delivery Boys */}
			{
				status?.value === "out for delivery" && (
					<div className="mt-2">

						{
							order?.shopOrder?.[0]?.assignedDeliveryBoy ? (
								<p className="small text-success">
									Assigned: {order?.shopOrder?.[0]?.assignedDeliveryBoy}
								</p>
							) : (
								<p className="small text-muted">Available Delivery Boys</p>
							)
						}

						{
							availableBoys.length > 0 && (
								<div className="d-flex flex-wrap gap-2 mt-1">

									{availableBoys.map((boy, idx) => (
										<span
											key={idx}
											className="px-2 py-1 small"
											style={{
												background: "#f1f1f1",
												borderRadius: "8px"
											}}
										>
											{boy.fullname}
										</span>
									))}

								</div>
							)
						}

					</div>
				)
			}

		</div>
	)
}

export default OrderCard