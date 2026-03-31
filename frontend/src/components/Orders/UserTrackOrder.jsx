import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { serverUrl } from '../../App'
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom'

// 🔥 Marker Icons
const userMarkerIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41]
})

const deliveryBoyMarkerIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41]
})

function UserTrackOrder() {

	const { orderId } = useParams()
	const [order, setOrder] = useState(null)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		fetchOrderDetails()
	}, [orderId])

	const fetchOrderDetails = async () => {
		try {
			setLoading(true)
			const res = await axios.get(`${serverUrl}/order/getOrderByid/${orderId}`, { withCredentials: true })
			setOrder(res?.data?.data)
		} catch (error) {
			toast.error("Failed to fetch order")
		} finally {
			setLoading(false)
		}
	}

	if (loading) return <div className="text-center mt-5">Loading...</div>
	if (!order) return <div className="text-center mt-5">Order not found</div>

	const userLocation = [
		order?.deliveryAddress?.lattitude || 0,
		order?.deliveryAddress?.longitude || 0
	]

	const deliveryBoyLocation = order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates
		? [
			order.shopOrder[0].assignedDeliveryBoy.location.coordinates[1],
			order.shopOrder[0].assignedDeliveryBoy.location.coordinates[0]
		]
		: null

	const mapCenter = deliveryBoyLocation
		? [(userLocation[0] + deliveryBoyLocation[0]) / 2, (userLocation[1] + deliveryBoyLocation[1]) / 2]
		: userLocation

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoArrowBack size={22} style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
					<h5 className="fw-bold m-0">Track Order</h5>
				</div>

				<div className="row g-3">

					{/* 🔥 LEFT */}
					<div className="col-12 col-lg-8">

						{/* 🔥 Order Info */}
						<div className="bg-white p-3 rounded shadow-sm mb-3">

							<div className="d-flex justify-content-between align-items-center">

								<div>
									<p className="mb-1 small text-muted">Order ID</p>
									<p className="fw-semibold mb-0">{order._id}</p>
								</div>

								<span
									className="px-3 py-1 small"
									style={{
										background: "#FFE5E5",
										color: "#FF4D4F",
										borderRadius: "20px",
										fontWeight: "500"
									}}
								>
									{order.status}
								</span>

							</div>

							<hr />

							<div className="d-flex justify-content-between small">
								<span>Total</span>
								<span className="fw-bold text-danger">₹{order.totalAmount}</span>
							</div>

						</div>

						{/* 🗺️ MAP */}
						<div
							className="bg-white rounded shadow-sm overflow-hidden"
							style={{ height: "300px" }}
						>

							<MapContainer center={mapCenter} zoom={15} style={{ height: "100%" }}>
								<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

								<Marker position={userLocation} icon={userMarkerIcon}>
									<Popup>Your Location</Popup>
								</Marker>

								{deliveryBoyLocation && (
									<>
										<Marker position={deliveryBoyLocation} icon={deliveryBoyMarkerIcon}>
											<Popup>Delivery Boy</Popup>
										</Marker>

										<Polyline
											positions={[deliveryBoyLocation, userLocation]}
											color="#FF4D4F"
										/>
									</>
								)}

							</MapContainer>

						</div>

					</div>

					{/* 🔥 RIGHT */}
					<div className="col-12 col-lg-4">

						<div className="bg-white p-3 rounded shadow-sm">

							<h6 className="fw-bold mb-3">Order Summary</h6>

							{order?.shopOrder?.map((shop, idx) => (
								<div key={idx} className="mb-3">

									<p className="fw-semibold mb-1">{shop?.shop?.name}</p>

									{shop?.shopOrderItems?.map((item, i) => (
										<div key={i} className="d-flex justify-content-between small">
											<span>{item.name} × {item.quantity}</span>
											<span>₹{item.price * item.quantity}</span>
										</div>
									))}

									<div className="text-end small mt-1">
										Subtotal: ₹{shop.subTotal}
									</div>

									<hr />
								</div>
							))}

							<h6 className="fw-bold text-danger">
								Total: ₹{order.totalAmount}
							</h6>

						</div>

						{/* 🔥 Timeline */}
						<div className="bg-white p-3 rounded shadow-sm mt-3">

							<h6 className="fw-bold mb-3">Order Status</h6>

							{["pending", "confirmed", "out for delivery", "delivered"].map((step, i) => {

								const completed =
									(step === "pending") ||
									(step === "confirmed" && order.status !== "pending") ||
									(step === "out for delivery" && ["out for delivery", "delivered"].includes(order.status)) ||
									(step === "delivered" && order.status === "delivered")

								return (
									<div key={i} className="d-flex align-items-center mb-2">

										<div
											style={{
												width: "12px",
												height: "12px",
												borderRadius: "50%",
												background: completed ? "#FF4D4F" : "#ddd"
											}}
										/>

										<span className="ms-2 small">
											{step}
										</span>

									</div>
								)
							})}

						</div>

					</div>

				</div>

			</div>
		</div>
	)
}

export default UserTrackOrder