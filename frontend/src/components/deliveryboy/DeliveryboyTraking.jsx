import React from 'react'
import { MapContainer, Marker, TileLayer, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 🔥 Custom Icons
const deliveryIcon = new L.Icon({
	iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
	iconSize: [35, 35]
})

const customerIcon = new L.Icon({
	iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
	iconSize: [30, 30]
})

function DeliveryboyTraking({ currentOrder }) {

	if (!currentOrder) return null

	const deliveryboyLat = currentOrder?.deliveryBoyLocation?.lat
	const deliveryboyLon = currentOrder?.deliveryBoyLocation?.lon

	const customerLat = currentOrder?.customerLocation?.lat
	const customerLon = currentOrder?.customerLocation?.lon

	// 🔥 Safety check
	if (!deliveryboyLat || !deliveryboyLon || !customerLat || !customerLon) {
		return (
			<div className="text-center small text-muted">
				Tracking not available
			</div>
		)
	}

	const path = [
		[deliveryboyLat, deliveryboyLon],
		[customerLat, customerLon]
	]

	const center = [deliveryboyLat, deliveryboyLon]

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
			}}
		>

			<MapContainer
				center={center}
				zoom={16}
				style={{ height: "100%", width: "100%" }}
			>

				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* 🔥 Delivery Boy Marker */}
				<Marker position={[deliveryboyLat, deliveryboyLon]} icon={deliveryIcon}>
					<Popup>🚴 Delivery Partner</Popup>
				</Marker>

				{/* 🔥 Customer Marker */}
				<Marker position={[customerLat, customerLon]} icon={customerIcon}>
					<Popup>🏠 Customer</Popup>
				</Marker>

				{/* 🔥 Route Line */}
				<Polyline
					positions={path}
					color="#FF4D4F"
					weight={4}
					opacity={0.8}
				/>

			</MapContainer>
		</div>
	)
}

export default DeliveryboyTraking