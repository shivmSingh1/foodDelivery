
const getCurrentLocation = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords
				resolve({ lat: latitude, long: longitude })
			},
			(error) => {
				reject(error)
			}
		)
	})
}

export default getCurrentLocation