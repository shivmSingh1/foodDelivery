import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	userDetails: null,
	city: null
}

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserDetails: (state, action) => {
			state.userDetails = action.payload
		},
		setCity: (state, action) => {
			state.city = action.payload
		}
	}
})

export const { setUserDetails, setCity } = userSlice.actions;
export default userSlice.reducer;