import React, { useState, useEffect } from 'react'
import { LiaRupeeSignSolid } from 'react-icons/lia'
import { MdAdd } from 'react-icons/md'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../redux/userSlice'

function CartCards({ item }) {

	const [quantity, setQuantity] = useState(item?.quantity || 1)
	const dispatch = useDispatch()

	// 🔥 Sync if item changes
	useEffect(() => {
		setQuantity(item?.quantity || 1)
	}, [item])

	// 🔥 Increment
	const handleIncrement = () => {
		const newQuantity = quantity + 1
		setQuantity(newQuantity)

		dispatch(addToCart({
			id: item?.id,
			quantity: newQuantity
		}))
	}

	// 🔥 Decrement
	const handleDecrement = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1
			setQuantity(newQuantity)

			dispatch(removeFromCart({
				id: item?.id,
				quantity: newQuantity
			}))
		}
	}

	return (
		<div
			className="bg-white p-2 p-md-3"
			style={{
				borderRadius: "12px",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
			}}
		>

			<div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-3">

				{/* 🔥 Image */}
				<img
					src={item?.image}
					alt={item?.name}
					className="object-fit-cover"
					style={{
						width: "100%",
						maxWidth: "110px",
						height: "90px",
						borderRadius: "10px"
					}}
				/>

				{/* 🔥 Info */}
				<div className="flex-grow-1">

					<p className="fw-semibold mb-1 small">
						{item?.name}
					</p>

					<p className="text-muted small mb-1">
						Type: {item?.foodType}
					</p>

					<p className="mb-1 small">
						<LiaRupeeSignSolid />
						{item?.price} × {quantity}
					</p>

					<p className="fw-bold mb-0">
						<LiaRupeeSignSolid />
						{item?.price * quantity}
					</p>

				</div>

				{/* 🔥 Quantity Controls */}
				<div
					className="d-flex align-items-center justify-content-center gap-2 px-2 py-1"
					style={{
						border: "1px solid #ddd",
						borderRadius: "8px",
						minWidth: "90px"
					}}
				>

					<RiSubtractFill
						style={{ cursor: "pointer" }}
						onClick={handleDecrement}
					/>

					<span className="small">{quantity}</span>

					<MdAdd
						style={{ cursor: "pointer" }}
						onClick={handleIncrement}
					/>

				</div>

			</div>
		</div>
	)
}

export default CartCards