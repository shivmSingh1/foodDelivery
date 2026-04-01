import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserDashboard from '../components/UserDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'
import OwnerDashboard from '../components/OwnerDashboard.jsx'

function Home() {
	const { userDetails } = useSelector(state => state.user)
	const navigate = useNavigate()

	// 🔥 Agar role missing hai
	if (!userDetails?.role) {
		return (
			<div
				className="d-flex flex-column justify-content-center align-items-center"
				style={{ height: "80vh" }}
			>
				<h3 className="mb-3">⚠️ Complete Your Profile</h3>
				<p className="text-muted mb-4 text-center" style={{ maxWidth: "300px" }}>
					Please complete your profile by adding phone number and selecting your role.
				</p>

				<button
					className="btn"
					style={{
						backgroundColor: "#FF4D4F",
						color: "#fff",
						borderRadius: "10px",
						padding: "10px 20px"
					}}
					onClick={() => navigate("/complete-profile")}
				>
					Complete Profile
				</button>
			</div>
		)
	}

	return (
		<div className='container'>
			{
				userDetails?.role === "user" && <UserDashboard />
			}
			{
				userDetails?.role === "deliveryBoy" && <DeliveryBoyDashboard />
			}
			{
				userDetails?.role === "owner" && <OwnerDashboard />
			}
		</div>
	)
}

export default Home