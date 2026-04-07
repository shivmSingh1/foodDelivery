import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import FoodItemsCard from "./FoodItemsCard";
import { IoArrowBack } from "react-icons/io5";
import { useLoader } from "../customHooks/useLoader";
import { toast } from 'react-toastify';

function ShopItemsPage() {

	const { shopId } = useParams()
	const [shop, setShop] = useState(null)
	const [items, setItems] = useState([])
	const { showLoader, hideLoader } = useLoader()

	const navigate = useNavigate()

	const fetchShopItems = async () => {
		try {
			showLoader('Loading shop items...')
			const res = await axios.get(
				`${serverUrl}/item/items/${shopId}`,
				{ withCredentials: true }
			)

			if (res.data.success) {
				setShop(res.data.shop)
				setItems(res.data.items)
			} else {
				toast.error("Failed to load shop items")
			}

		} catch (error) {
			toast.error(error?.response?.data?.message || "Error loading shop items")
		} finally {
			hideLoader()
		}
	}

	useEffect(() => {
		if (shopId) fetchShopItems()
	}, [shopId])

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoArrowBack
						size={22}
						style={{ cursor: "pointer" }}
						onClick={() => navigate(-1)}
					/>
					<h5 className="fw-bold m-0">Shop Details</h5>
				</div>

				{/* 🔥 Shop Card */}
				{
					shop && (
						<div
							className="bg-white p-3 p-md-4 mb-4"
							style={{
								borderRadius: "14px",
								boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
							}}
						>

							{/* Image */}
							<div style={{ height: "180px", overflow: "hidden" }}>
								<img
									src={shop?.image}
									alt={shop?.name}
									className="w-100 h-100 object-fit-cover"
									style={{ borderRadius: "10px" }}
								/>
							</div>

							{/* Info */}
							<div className="mt-3">

								<h5 className="fw-bold mb-1">
									{shop?.name}
								</h5>

								<p className="mb-1 text-muted small">
									{shop?.address}
								</p>

								<p className="small text-muted mb-0">
									{shop?.city}, {shop?.state}
								</p>

							</div>

						</div>
					)
				}

				{/* 🔥 Items Section */}
				<div>

					<div className="d-flex justify-content-between align-items-center mb-3">
						<h6 className="fw-bold mb-0">Available Items</h6>

						<span
							className="px-3 py-1 small"
							style={{
								background: "#FFE5E5",
								color: "#FF4D4F",
								borderRadius: "20px"
							}}
						>
							{items.length} Items
						</span>
					</div>

					{/* 🔥 Empty State */}
					{
						items.length === 0 && (
							<div className="d-flex justify-content-center mt-4">

								<div
									className="bg-white p-4 text-center"
									style={{
										borderRadius: "14px",
										boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
										maxWidth: "300px",
										width: "100%"
									}}
								>
									<p className="mb-0 small text-muted">
										No items available 🍽️
									</p>
								</div>

							</div>
						)
					}

					{/* 🔥 Grid */}
					{
						items.length > 0 && (
							<div className="row g-3">

								{items.map((item, index) => (
									<div key={index} className="col-6 col-md-4 col-lg-3">
										<FoodItemsCard item={item} />
									</div>
								))}

							</div>
						)
					}

				</div>

			</div>
		</div>
	)
}

export default ShopItemsPage