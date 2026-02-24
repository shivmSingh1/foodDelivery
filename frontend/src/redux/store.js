import { configureStore } from "@reduxjs/toolkit"
import { userSlice } from "./userSlice"
import { shopSlice } from "./shopSlice"

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		Shop: shopSlice.reducer
	}
})