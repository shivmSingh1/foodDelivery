import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	location: {
		lat: null,
		long: null
	},
	address: ""
}

export const mapSlice = createSlice({
	name: "Map",
	initialState,
	reducers: {
		setLocation: (state, action) => {
			const { lat, long } = action.payload;
			state.location.lat = lat;
			state.location.long = long;
		},
		setAddress: (state, action) => {
			const address = action.payload;
			state.address = address;
		}
	}
})

export const { setLocation, setAddress } = mapSlice.actions;
export default mapSlice.reducer;