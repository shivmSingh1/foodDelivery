import axios from "axios";

const getAddress = async (search) => {
	try {
		const apikey = import.meta.env.VITE_GEO_APIKEY;
		const res = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search)}&format=json&apiKey=${apikey}`)
		const location = {
			lat: res?.data?.results?.[0]?.lat,
			long: res?.data?.results?.[0]?.lon
		}
		return location
	} catch (error) {
		console.log(error.message)
	}
}

export default getAddress