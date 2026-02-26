import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCity } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function UseCurrentCity() {
	const { userDetails } = useSelector(state => state.user)
	const dispatch = useDispatch()
	useEffect(() => {
		const apikey = import.meta.env.VITE_GEO_APIKEY
		const getCurrentCity = async () => {
			navigator.geolocation.getCurrentPosition(async (pos) => {
				const lat = Number(pos.coords.latitude);
				const long = Number(pos.coords.longitude);
				const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${apikey}`)
				const city = res?.data?.features[0]?.properties?.city
				dispatch(setCity(city))
				dispatch(setLocation({ lat, long }))
				const address = res?.data?.features?.[0]?.properties?.formatted
				dispatch(setAddress(address))
			})
		}
		getCurrentCity()
	}, [userDetails])
}

export default UseCurrentCity