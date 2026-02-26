import React from 'react'
import Autocomplete from "react-google-autocomplete";

function GoogleAddressInput() {
	return (
		<div>
			<Autocomplete
				apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
				style={{ width: "90%" }}
				onPlaceSelected={(place) => {
					console.log(place);
				}}
				options={{
					types: ["(regions)"],
					componentRestrictions: { country: "ru" },
				}}
				defaultValue="Amsterdam"
			/>;
		</div>
	)
}

export default GoogleAddressInput