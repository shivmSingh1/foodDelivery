import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteModal from './DeleteModal'

function ItemCard({ item }) {

	const navigate = useNavigate()
	const [modalShow, setModalShow] = useState(false)

	return (
		<div
			className="bg-white p-2 p-md-3 h-100"
			style={{
				borderRadius: "12px",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
				transition: "0.3s"
			}}
		>

			{/* 🔥 Image */}
			<div style={{ height: "120px", overflow: "hidden" }}>
				<img
					src={item?.image}
					alt={item?.name}
					className="w-100 h-100 object-fit-cover"
					style={{ borderRadius: "10px" }}
				/>
			</div>

			{/* 🔥 Content */}
			<div className="mt-2 d-flex flex-column">

				{/* Name */}
				<p className="fw-semibold mb-1 small text-truncate">
					{item?.name}
				</p>

				{/* Price */}
				<p className="fw-bold mb-1 small text-danger">
					₹{item?.price}
				</p>

				{/* Category */}
				<p className="text-muted mb-2 small">
					{item?.category} • {item?.foodType}
				</p>

				{/* 🔥 Actions */}
				<div className="d-flex justify-content-between align-items-center mt-auto">

					<button
						className="btn btn-sm d-flex align-items-center gap-1"
						style={{
							background: "#f1f1f1",
							borderRadius: "8px"
						}}
						onClick={() => navigate(`/add-item/${item?._id}`)}
					>
						<FaEdit size={12} />
						<span className="small">Edit</span>
					</button>

					<button
						className="btn btn-sm d-flex align-items-center gap-1"
						style={{
							background: "#ffe5e5",
							color: "#FF4D4F",
							borderRadius: "8px"
						}}
						onClick={() => setModalShow(true)}
					>
						<FaTrash size={12} />
						<span className="small">Delete</span>
					</button>

				</div>

			</div>

			{/* 🔥 Modal */}
			<DeleteModal
				id={item?._id}
				show={modalShow}
				onHide={() => setModalShow(false)}
			/>

		</div>
	)
}

export default ItemCard