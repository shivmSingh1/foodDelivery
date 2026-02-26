import React from 'react'
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { CiShoppingCart } from 'react-icons/ci';
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/userSlice';
import { useEffect } from 'react';

function FoodItemsCard({ item }) {
	const dispatch = useDispatch()
	const { cart } = useSelector((state) => state.user)
	const [cartItemNo, setCartItemNo] = useState(0)
	let stars = [];
	let rating = 2;
	for (let i = 1; i <= 5; i++) {
		if (i <= rating) {
			stars.push(<MdOutlineStar key={i} />)
		} else {
			stars.push(<MdOutlineStarBorder key={i} />)
		}
	}

	const setItemQuantity = (item) => {
		const cartItem = cart?.find((c, i) => (
			c.id === item._id
		))
		if (cartItem && cartItem.quantity > 0) {
			setCartItemNo(cartItem?.quantity)
		}
	}

	useEffect(() => {
		if (cart) {
			setItemQuantity(item)
		}
	}, [cart])

	const handleAddToCart = (item) => {
		dispatch(addToCart(
			{
				id: item?._id,
				name: item?.name,
				price: item?.price,
				image: item?.image,
				shop: item?.shop,
				quantity: cartItemNo + 1,
				foodType: item?.foodType
			}
		))
	}
	const handleIncrement = () => {
		setCartItemNo((prev) => prev + 1);
		handleAddToCart(item)
	}
	const handleRemoveFromCart = (item) => {
		console.log(cartItemNo - 1)
		console.log(item?._id, "yeee")
		dispatch(removeFromCart({
			id: item?._id,
			quantity: cartItemNo - 1
		}))
	}
	const handleDecrement = () => {
		if (cartItemNo > 0) {
			setCartItemNo((prev) => prev - 1)
		}
		handleRemoveFromCart(item)
	}
	return (
		<div
			className='d-flex flex-column border rounded p-2'
			style={{ width: "150px" }}
		>
			<div>
				<img
					src={item?.image}
					alt={item?.name}
					className="object-fit-cover w-100"
					style={{ height: "100px" }}
				/>
			</div>

			<p className='text-truncate mb-0 pb-0'>
				{item?.name}
			</p>

			<span className="text-primary">
				{stars}
			</span>




			<div className='d-flex justify-content-between' >
				<small className='d-flex align-items-center'><LiaRupeeSignSolid />{item?.price}</small>
				<small className='p-1 ms-2 rounded border d-flex gap-1 align-items-center justify-content-center' >
					<span style={{ cursor: "pointer" }} onClick={handleDecrement} ><RiSubtractFill /></span>
					<span>{cartItemNo}</span>
					<span style={{ cursor: "pointer" }} onClick={handleIncrement} ><MdAdd /></span>
					<span  ><CiShoppingCart /></span>
				</small>
			</div>
		</div>
	)
}

export default FoodItemsCard

