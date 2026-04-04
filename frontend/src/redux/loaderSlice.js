import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	loadingMessage: "",
};

export const loaderSlice = createSlice({
	name: "loader",
	initialState,
	reducers: {
		startLoading: (state, action) => {
			state.isLoading = true;
			state.loadingMessage = action.payload || "Loading...";
		},
		stopLoading: (state) => {
			state.isLoading = false;
			state.loadingMessage = "";
		},
	},
});

export const { startLoading, stopLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
