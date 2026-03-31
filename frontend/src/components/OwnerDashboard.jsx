import React from 'react'
import Nav from './Nav'
import UseGetShops from '../customHooks/UseGetShops'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import ItemCard from './ItemCard'

function OwnerDashboard() {

	UseGetShops()

	const { shopDetails } = useSelector(state => state.Shop)
	const navigate = useNavigate()

	// 🔥 No Shop State
	if (shopDetails.length <= 0) {
		return (
			<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

				<Nav isUser={false} isOwner={true} />

				<div className="container py-5 d-flex justify-content-center">

					<div
						className="bg-white text-center p-4"
						style={{
							borderRadius: "14px",
							boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
							maxWidth: "350px",
							width: "100%"
						}}
					>
						<h5 className="fw-bold mb-2">Add Your Restaurant</h5>
						<p className="text-muted small mb-3">
							Join our platform & reach thousands of customers 🚀
						</p>

						<button
							className="btn w-100"
							style={{
								background: "#FF4D4F",
								color: "#fff",
								borderRadius: "10px"
							}}
							onClick={() => navigate("/create-edit-shop")}
						>
							Get Started
						</button>
					</div>

				</div>

			</div>
		)
	}

	const shop = shopDetails[0]

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<Nav isUser={false} isOwner={true} isDeliveryBoy={false} />

			<div className="container py-3">

				{/* 🔥 SHOP HEADER */}
				<div className="bg-white p-3 p-md-4 rounded shadow-sm mb-4">

					<div className="row align-items-center">

						{/* Image */}
						<div className="col-12 col-md-3 text-center mb-3 mb-md-0 position-relative">

							<img
								src={shop?.image}
								alt={shop?.name}
								className="w-100"
								style={{
									maxHeight: "150px",
									objectFit: "cover",
									borderRadius: "12px"
								}}
							/>

							<FaEdit
								size={18}
								style={{
									position: "absolute",
									top: "10px",
									right: "10px",
									background: "#fff",
									padding: "6px",
									borderRadius: "50%",
									cursor: "pointer"
								}}
								onClick={() => navigate("/create-edit-shop")}
							/>

						</div>

						{/* Info */}
						<div className="col-12 col-md-9">

							<h5 className="fw-bold mb-1">
								Welcome, {shop?.name}
							</h5>

							<p className="text-muted mb-1 small">
								{shop?.city}, {shop?.state}
							</p>

							<p className="small mb-0">
								{shop?.address}
							</p>

						</div>

					</div>

				</div>

				{/* 🔥 EMPTY ITEMS */}
				{
					shop?.items?.length === 0 && (
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
								<h6 className="fw-bold mb-2">Add Food Items</h6>
								<p className="text-muted small mb-3">
									Share your delicious creations 🍔
								</p>

								<button
									className="btn w-100"
									style={{
										background: "#FF4D4F",
										color: "#fff",
										borderRadius: "10px"
									}}
									onClick={() => navigate("/add-item")}
								>
									Add Items
								</button>
							</div>

						</div>
					)
				}

				{/* 🔥 ITEMS GRID */}
				{
					shop?.items?.length > 0 && (
						<div>

							<div className="d-flex justify-content-between align-items-center mb-3">

								<h6 className="fw-bold mb-0">Your Menu</h6>

								<button
									className="btn btn-sm"
									style={{
										background: "#FF4D4F",
										color: "#fff",
										borderRadius: "8px"
									}}
									onClick={() => navigate("/add-item")}
								>
									Add Item
								</button>

							</div>

							<div className="row g-3">

								{shop?.items?.map((item, index) => (
									<div key={index} className="col-6 col-md-4 col-lg-3">
										<ItemCard item={item} />
									</div>
								))}

							</div>

						</div>
					)
				}

			</div>
		</div>
	)
}

export default OwnerDashboard