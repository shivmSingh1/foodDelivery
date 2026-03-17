import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLocation } from "../redux/mapSlice"
import axios from "axios"
import { serverUrl } from "../App"

const UseUpdateLocation = () => {
	const { userDetails } = useSelector((state) => state.user)
	useEffect(() => {
		const updateLocation = async (location) => {
			const res = await axios.put(`${serverUrl}/user/updateUserLocation`, location, { withCredentials: true })
		}
		navigator.geolocation.watchPosition((pos) => {
			const location = {
				lat: pos.coords.latitude,
				long: pos.coords.longitude
			}
			updateLocation(location)
		})
	}, [])
}

export default UseUpdateLocation;