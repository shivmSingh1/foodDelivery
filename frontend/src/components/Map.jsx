import React, { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useDispatch } from 'react-redux'
import { setLocation } from '../redux/mapSlice'
import L from 'leaflet'

// 🔥 Custom Marker (theme based)
const customMarker = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41]
})

// 🔥 Recenter map when location changes
function RecenterMap({ lat, lng }) {
	const map = useMap()

	useEffect(() => {
		if (lat && lng) {
			map.setView([lat, lng], 16)
		}
	}, [lat, lng, map])

	return null
}

function Map({ location, setNewLocation }) {

	const dispatch = useDispatch()

	// 🔥 Drag handler
	const eventHandlers = {
		dragend: (e) => {
			const marker = e.target
			const position = marker.getLatLng()

			const newLocation = {
				lat: position.lat,
				long: position.lng
			}

			dispatch(setLocation(newLocation))

			if (setNewLocation) {
				setNewLocation(newLocation)
			}
		}
	}

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
				center={[location?.lat, location?.long]}
				zoom={16}
				style={{ height: "100%", width: "100%" }}
			>

				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<RecenterMap lat={location?.lat} lng={location?.long} />

				<Marker
					position={[location?.lat, location?.long]}
					draggable={true}
					eventHandlers={eventHandlers}
					icon={customMarker}
				/>

			</MapContainer>

		</div>
	)
}

export default Map