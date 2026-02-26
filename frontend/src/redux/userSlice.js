import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	userDetails: null,
	city: null,
	cart: [],
	totalAmount: 0
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
		},
		addToCart: (state, action) => {
			const cartItems = state.cart;
			const item = action.payload;
			const existingCartItem = cartItems.find((cartItem) => cartItem.id === item.id);
			if (existingCartItem) {
				existingCartItem.quantity = item.quantity || item?.newQuantity;
			} else {
				state?.cart?.push(action.payload)
			}
		},
		removeFromCart: (state, action) => {
			const item = action.payload;
			console.log(item?.id, item?.quantity)
			const existingCartItem = state?.cart?.find((c) => c.id === item?.id)
			if (existingCartItem) {
				if (item?.quantity === 0 || item?.newQuantity === 0) {
					state.cart = state.cart.filter((c) => c.id !== item?.id)
				}
				existingCartItem.quantity = item?.quantity || item?.newQuantity;
			}
		},
		cartTotalAmount: (state, action) => {
			state.totalAmount = state.cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);
		}
	}
})

export const { setUserDetails, setCity, addToCart, removeFromCart, cartTotalAmount } = userSlice.actions;
export default userSlice.reducer;