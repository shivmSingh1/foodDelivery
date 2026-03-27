import React from 'react'
import OrderItemsCard from './OrderItemsCard'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

function OrdersByShopsCard({ order }) {
	const navigate = useNavigate()
	console.log("order", order)

	const handleTrackOrder = () => {
		navigate(`/track-order/${order?._id}`)
	}

	return (
		<div className='p-4 w-100 bg-light m-2 mb-4 d-flex flex-column shadow-sm ' style={{ minHeight: "100px" }} >
			<div className='d-flex justify-content-between p-2' >
				<div>
					<h6 className='pb-0 mb-0' >Order #{order?._id}</h6>
					<small>Date: {new Date(order?.createdAt).toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric"
					})}</small>
				</div>
				<b >Status: <span className='text-primary' >{order?.status}</span></b>
			</div>
			<hr />
			<div className='d-flex flex-column gap-1 w-100' >
				{order?.shopOrder?.map((items, idx) => {
					return <div>
						<b>{items?.shop?.name}</b>
						<div className='p-2 d-flex w-100' >
							{
								items?.shopOrderItems?.map((i) => (
									<OrderItemsCard key={idx} item={i} />
								))
							}
						</div>
						<strong>Sub Total: {items?.subTotal}</strong>
						<hr />
					</div>
				})}
			</div>
			<div className='p-2 d-flex align-items-center justify-content-between' >
				<h4>Total: <FaIndianRupeeSign />{order?.totalAmount}</h4>
				<button className='btn btn-success' onClick={handleTrackOrder}>Track Order</button>
			</div>
		</div>
	)
}

export default OrdersByShopsCard