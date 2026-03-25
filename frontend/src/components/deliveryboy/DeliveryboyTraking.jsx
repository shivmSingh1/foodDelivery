import React from 'react'
import { MapContainer, Marker, TileLayer, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function DeliveryboyTraking({ currentOrder }) {
	console.log(currentOrder, "sdsd")
	const deliveryboyLat = currentOrder.deliveryBoyLocation.lat;
	const deliveryboyLon = currentOrder.deliveryBoyLocation.lon;

	const customerLat = currentOrder.customerLocation.lat;
	const customerLon = currentOrder.customerLocation.lon;

	// console.log(deliveryboyLat, deliveryboyLon, customerLat, customerLon)

	const path = [
		[deliveryboyLat, deliveryboyLon],
		[customerLat, customerLon]
	]

	const center = [deliveryboyLat, deliveryboyLon]
	return (
		<div style={{ height: "300px", width: "450px" }}>
			<MapContainer
				center={center}
				zoom={16}
				style={{ height: "100%", width: "100%" }}
			>

				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Marker position={[deliveryboyLat, deliveryboyLon]}>
					<Popup>Delivery Boy Location</Popup>
				</Marker>

				<Marker position={[customerLat, customerLon]}>
					<Popup>Customer Location</Popup>
				</Marker>

				<Polyline positions={path} color="blue" weight={3} opacity={0.7} />

			</MapContainer>
		</div>
	)
}

export default DeliveryboyTraking