import React from 'react'
import { useState } from 'react'
import { LiaRupeeSignSolid } from 'react-icons/lia'
import { MdAdd } from 'react-icons/md'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../redux/userSlice'
import { useEffect } from 'react'

function CartCards({ item }) {
	const [quantity, setQuantity] = useState(item?.quantity)
	const { cart } = useSelector((state) => state.user)
	const dispatch = useDispatch()
	const handleIncrement = () => {
		setQuantity((prev) => prev + 1)
		const newQuantity = quantity + 1;
		dispatch(addToCart({ id: item?.id, newQuantity }))
	}
	const handleDecrement = () => {
		if (quantity > 0) {
			setQuantity((prev) => prev - 1);
			const newQuantity = quantity - 1;
			dispatch(removeFromCart({ id: item?.id, newQuantity }))
		}
	}
	useEffect(() => {
		if (item) {
			console.log("itemmmm", item)
		}
	}, [item])
	return (
		<div className='border shadow p-2 rounded' style={{ width: "500px" }} >
			<div className='d-flex justify-content-between align-items-center ' >
				<div className='d-flex' >
					<img src={item.image} alt="" width={"150px"} height={"150px"} />
					<div className='d-flex gap-0 flex-column ms-2' >
						<p className='d-block mb-0 pb-0' >{item?.name}</p>
						<p  >Type: {item?.foodType}</p>
						<small><p className='mb-0'><LiaRupeeSignSolid />{item?.price} * {item?.quantity}</p></small>
						<strong><LiaRupeeSignSolid />{(item?.price) * (item?.quantity)}</strong>
					</div>
				</div>
				<div className='d-flex border rounded p-2 px-3 gap-1' >
					<span style={{ cursor: "pointer" }} onClick={handleDecrement} ><RiSubtractFill /></span>
					<span>{quantity}</span>
					<span style={{ cursor: "pointer" }} onClick={handleIncrement} ><MdAdd /></span>
				</div>
			</div>
		</div>
	)
}

export default CartCards