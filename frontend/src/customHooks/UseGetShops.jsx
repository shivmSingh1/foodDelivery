import { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { setShopDetails } from "../redux/shopSlice"
import axios from "axios"

const UseGetShops = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const getShops = async () => {
			try {
				const res = await axios.get(`${serverUrl}/shop/getShops`, { withCredentials: true });
				if (res.status === 200) {
					dispatch(setShopDetails(res?.data?.data))
				}
			} catch (error) {
				console.log(error.message)
				toast.error(error?.response?.data?.message)
			}
		}
		getShops()
	}, [])
}

export default UseGetShops;