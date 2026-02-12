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
				const res = await axios.get(`${serverUrl}/user/getCurrentUser`, { withCredentials: true })
				console.log("ressss", res)
				if (res.status === 200) {
					alert("success in getting current user")
				}
				dispatch(setUserDetails(res?.data?.data))
			} catch (error) {
				console.log("error in fetching current user", error.message)
			}
		}
		fetchUser()
	}, [])
}

export default useCurrentUser