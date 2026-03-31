import React from 'react'
import OrderItemsCard from './OrderItemsCard'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

function OrdersByShopsCard({ order }) {

	const navigate = useNavigate()

	const handleTrackOrder = () => {
		navigate(`/track-order/${order?._id}`)
	}

	return (
		<div
			className="bg-white p-3 p-md-4"
			style={{
				borderRadius: "14px",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
			}}
		>

			{/* 🔥 Header */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">

				<div>
					<h6 className="mb-0 fw-bold">
						Order #{order?._id}
					</h6>

					<small className="text-muted">
						{new Date(order?.createdAt).toLocaleDateString("en-GB", {
							day: "numeric",
							month: "short",
							year: "numeric"
						})}
					</small>
				</div>

				{/* 🔥 Status Badge */}
				<span
					className="px-2 py-1 small"
					style={{
						borderRadius: "8px",
						background: "#e6f4ff",
						color: "#1677ff",
						fontWeight: "500"
					}}
				>
					{order?.status}
				</span>

			</div>

			<hr className="my-3" />

			{/* 🔥 Shops + Items */}
			<div className="d-flex flex-column gap-3">

				{order?.shopOrder?.map((items, idx) => (
					<div key={idx}>

						{/* 🏪 Shop Name */}
						<p className="fw-semibold mb-1">
							{items?.shop?.name}
						</p>

						{/* 🍔 Items */}
						<div className="d-flex flex-column gap-2">

							{items?.shopOrderItems?.map((i, iidx) => (
								<OrderItemsCard key={iidx} item={i} />
							))}

						</div>

						{/* 💰 Subtotal */}
						<div className="d-flex justify-content-between mt-2 small">
							<span className="text-muted">Subtotal</span>
							<span className="fw-semibold">
								<FaIndianRupeeSign /> {items?.subTotal}
							</span>
						</div>

						<hr className="my-2" />

					</div>
				))}

			</div>

			{/* 🔥 Footer */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mt-2">

				<h6 className="fw-bold mb-0">
					Total: <FaIndianRupeeSign /> {order?.totalAmount}
				</h6>

				<button
					className="btn btn-sm"
					style={{
						background: "#FF4D4F",
						color: "#fff",
						borderRadius: "8px"
					}}
					onClick={handleTrackOrder}
				>
					Track Order
				</button>

			</div>

		</div>
	)
}

export default OrdersByShopsCard