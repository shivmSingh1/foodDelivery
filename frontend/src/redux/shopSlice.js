import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	shopDetails: []
}

export const shopSlice = createSlice({
	name: "Shop",
	initialState,
	reducers: {
		setShopDetails: (state, action) => {
			state.shopDetails = action.payload
		}
	}
})

export const { setShopDetails } = shopSlice.actions;
export default shopSlice.reducer;