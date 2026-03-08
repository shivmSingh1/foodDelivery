import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	shopDetails: [],
	ownerOrder: []
}

export const shopSlice = createSlice({
	name: "Shop",
	initialState,
	reducers: {
		setShopDetails: (state, action) => {
			state.shopDetails = action.payload
		},
		setOwnerOrder: (state, action) => {
			state.orderStatus = action.payload
		}
	}
})

export const { setShopDetails, setOwnerOrder } = shopSlice.actions;
export default shopSlice.reducer;