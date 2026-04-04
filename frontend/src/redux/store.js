import { configureStore } from "@reduxjs/toolkit"
import { userSlice } from "./userSlice"
import { shopSlice } from "./shopSlice"
import { mapSlice } from "./mapSlice"
import loaderSlice from "./loaderSlice"

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		Shop: shopSlice.reducer,
		Map: mapSlice.reducer,
		loader: loaderSlice
	}
})