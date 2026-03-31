import React from 'react'

function CategoryCard({ category }) {
	return (
		<div
			className="d-flex flex-column align-items-center"
			style={{
				cursor: "pointer",
				transition: "0.3s"
			}}
		>

			{/* 🔥 Image Circle */}
			<div
				className="d-flex align-items-center justify-content-center"
				style={{
					width: "70px",
					height: "70px",
					borderRadius: "50%",
					overflow: "hidden",
					background: "#fff",
					boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
				}}
			>
				<img
					src={category?.image}
					alt={category?.name}
					className="w-100 h-100 object-fit-cover"
				/>
			</div>

			{/* 🔥 Name */}
			<p
				className="mt-2 text-center mb-0 small fw-medium"
				style={{
					maxWidth: "80px",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis"
				}}
			>
				{category?.name}
			</p>

		</div>
	)
}

export default CategoryCard