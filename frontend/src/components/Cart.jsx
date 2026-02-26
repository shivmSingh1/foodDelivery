import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartCards from './CartCards';
import { LiaRupeeSignSolid } from 'react-icons/lia';

function Cart() {
	const navigate = useNavigate()
	const { cart, totalAmount } = useSelector((state) => state.user)
	return (
		<div className='container mt-4' >
			<span className='mt-4' onClick={() => navigate(-1)} ><IoArrowBack size={25} /></span>
			<div className='d-flex justify-content-center' >
				{
					cart?.length <= 0 && (
						<div className='d-flex gap-2 w-25 rounded shadow-sm p-2 flex-column align-items-center' >
							<h5>Your cart is empty.</h5>
						</div>
					)
				}
			</div>
			<div className='d-flex' >
				<div className='d-flex mt-4 w-50 gap-2 flex-column align-items-center' >
					{
						cart && cart.map((c, i) => (
							<CartCards item={c} key={i} />
						))
					}
				</div >
				{
					cart.length > 0 && (
						<div className='w-50 p-4 ' >
							<div className='d-flex justify-content-between border rounded p-3' >
								<span><h5>Total Amount</h5></span>
								<span><h5 ><LiaRupeeSignSolid />{totalAmount && totalAmount}</h5></span>
							</div>
							<div className='d-flex justify-content-end mt-3' >
								<button className='btn btn-success' onClick={() => navigate("/checkout")} >Proceed to checkout</button>
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
}

export default Cart