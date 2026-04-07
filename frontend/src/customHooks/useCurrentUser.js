import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserDetails } from "../redux/userSlice"

const useCurrentUser = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`${serverUrl}/user/getCurrentUser`, {
					withCredentials: true,
					headers: {
						"Content-Type": "application/json"
					}
				})
				if (res.status === 200 && res?.data?.data) {
					dispatch(setUserDetails(res?.data?.data))
					console.log("Current user fetched successfully")
				}
			} catch (error) {
				// Only log if it's not a 401 (Unauthorized - which is expected on first load)
				if (error.response?.status !== 401) {
					console.log(" Error in fetching current user:", error.response?.data?.message || error.message)
				}
				// 401 errors are expected when user is not authenticated yet
			}
		}
		fetchUser()
	}, [dispatch])
}

export default useCurrentUser