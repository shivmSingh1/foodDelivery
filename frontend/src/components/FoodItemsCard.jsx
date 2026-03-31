import React, { useEffect, useState } from 'react'
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/userSlice';

function FoodItemsCard({ item }) {

	const dispatch = useDispatch()
	const { cart } = useSelector((state) => state.user)

	const [cartItemNo, setCartItemNo] = useState(0)

	// ⭐ Rating UI
	let stars = [];
	let rating = 4;

	for (let i = 1; i <= 5; i++) {
		stars.push(i <= rating ? <MdOutlineStar key={i} /> : <MdOutlineStarBorder key={i} />)
	}

	// 🔥 Sync cart
	const setItemQuantity = () => {
		const cartItem = cart?.find(c => c.id === item._id)
		if (cartItem) setCartItemNo(cartItem.quantity)
		else setCartItemNo(0)
	}

	useEffect(() => {
		setItemQuantity()
	}, [cart])

	// 🔥 Add
	const handleAdd = () => {
		dispatch(addToCart({
			id: item?._id,
			name: item?.name,
			price: item?.price,
			image: item?.image,
			shop: item?.shop,
			quantity: cartItemNo + 1,
			foodType: item?.foodType
		}))
	}

	// 🔥 Increment
	const handleIncrement = () => {
		setCartItemNo(prev => prev + 1)
		handleAdd()
	}

	// 🔥 Decrement
	const handleDecrement = () => {
		if (cartItemNo > 0) {
			setCartItemNo(prev => prev - 1)
			dispatch(removeFromCart({
				id: item?._id,
				quantity: cartItemNo - 1
			}))
		}
	}

	return (
		<div
			className="h-100 d-flex flex-column"
			style={{
				borderRadius: "14px",
				overflow: "hidden",
				background: "#fff",
				boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
				transition: "0.3s"
			}}
		>

			{/* 🔥 Image */}
			<div style={{ height: "140px", overflow: "hidden" }}>
				<img
					src={item?.image}
					alt={item?.name}
					className="w-100 h-100 object-fit-cover"
					style={{ transition: "0.3s" }}
				/>
			</div>

			{/* 🔥 Content */}
			<div className="p-2 d-flex flex-column flex-grow-1">

				{/* Name */}
				<p className="fw-semibold mb-1 text-truncate small">
					{item?.name}
				</p>

				{/* Rating */}
				<div className="text-warning small mb-1">
					{stars}
				</div>

				{/* Price + Cart */}
				<div className="d-flex justify-content-between align-items-center mt-auto">

					<span className="fw-bold d-flex align-items-center small">
						<LiaRupeeSignSolid />
						{item?.price}
					</span>

					{/* 🔥 Add / Quantity */}
					{
						cartItemNo === 0 ? (
							<button
								className="btn btn-sm"
								style={{
									background: "#FF4D4F",
									color: "#fff",
									borderRadius: "8px",
									fontSize: "12px",
									padding: "4px 10px"
								}}
								onClick={handleIncrement}
							>
								Add
							</button>
						) : (
							<div
								className="d-flex align-items-center gap-2 px-2"
								style={{
									border: "1px solid #ddd",
									borderRadius: "8px"
								}}
							>
								<RiSubtractFill
									style={{ cursor: "pointer" }}
									onClick={handleDecrement}
								/>
								<span className="small">{cartItemNo}</span>
								<MdAdd
									style={{ cursor: "pointer" }}
									onClick={handleIncrement}
								/>
							</div>
						)
					}

				</div>

			</div>
		</div>
	)
}

export default FoodItemsCard