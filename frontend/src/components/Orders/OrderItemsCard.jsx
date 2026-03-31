import React from 'react'

function OrderItemsCard({ item }) {

	return (
		<div
			className="d-flex align-items-center gap-2 p-2"
			style={{
				borderRadius: "10px",
				background: "#fafafa",
				border: "1px solid #eee"
			}}
		>

			{/* 🔥 Image */}
			<img
				src={item?.image}
				alt={item?.name}
				className="object-fit-cover"
				style={{
					width: "60px",
					height: "60px",
					borderRadius: "8px"
				}}
			/>

			{/* 🔥 Info */}
			<div className="flex-grow-1">

				<p className="mb-0 small fw-semibold text-truncate">
					{item?.name}
				</p>

				<small className="text-muted">
					{item?.quantity} × ₹{item?.price}
				</small>

			</div>

		</div>
	)
}

export default OrderItemsCard