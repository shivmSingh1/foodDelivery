import React from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setLocation } from '../redux/mapSlice';
import { useEffect } from 'react';
import axios from 'axios';


function RecenterMap({ lat, lng }) {
	const map = useMap()

	useEffect(() => {
		if (lat && lng) {
			map.setView([lat, lng], 16)
		}
	}, [lat, lng])

	return null
}

function Map({ location, setNewLocation }) {
	const dispatch = useDispatch()

	const eventHandlers = {
		dragend: (e) => {
			const marker = e.target
			const position = marker.getLatLng()
			dispatch(setLocation({ lat: position?.lat, long: position?.lng }))
			const location = { lat: position?.lat, long: position?.lng }
			setNewLocation(location)
		}
	}

	return (
		<MapContainer
			center={{ lat: location?.lat, lng: location?.long }}
			zoom={16}
			style={{ height: "100%", width: "100%" }}
		>

			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<RecenterMap lat={location.lat} lng={location.long} />

			<Marker
				position={{ lat: location?.lat, lng: location?.long }}
				draggable={true}
				eventHandlers={eventHandlers}  >
			</Marker>

		</MapContainer>
	)
}

export default Map