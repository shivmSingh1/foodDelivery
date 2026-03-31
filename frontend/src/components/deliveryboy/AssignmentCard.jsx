import axios from 'axios'
import React, { useState } from 'react'
import { serverUrl } from '../../App'
import { toast } from 'react-toastify'

function AssignmentCard({ assign, fetchCurrentOrder }) {

	const [loading, setLoading] = useState(false)

	const acceptOrder = async (assignmentId) => {
		try {
			setLoading(true)

			const res = await axios.get(
				`${serverUrl}/order/accept-order/${assignmentId}`,
				{ withCredentials: true }
			)

			if (res.status === 200) {
				await fetchCurrentOrder()
				toast.success(res.data.message)
			}

		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="bg-white p-3"
			style={{
				borderRadius: "12px",
				boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
			}}
		>

			<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">

				{/* 🔥 Info */}
				<div>

					<h6 className="fw-bold mb-1">
						{assign?.shopname}
					</h6>

					<p className="small text-muted mb-1">
						📍 {assign?.deliveryAddress?.text}
					</p>

					<p className="small mb-0">
						{assign?.items?.length} items • ₹{assign?.subTotal}
					</p>

				</div>

				{/* 🔥 Action */}
				<button
					className="btn btn-sm"
					style={{
						background: "#FF4D4F",
						color: "#fff",
						borderRadius: "8px",
						minWidth: "100px"
					}}
					onClick={() => acceptOrder(assign?.assignmentId)}
					disabled={loading}
				>
					{loading ? "Accepting..." : "Accept"}
				</button>

			</div>

		</div>
	)
}

export default AssignmentCard