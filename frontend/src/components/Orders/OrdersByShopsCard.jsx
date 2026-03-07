import React from 'react'
import OrderItemsCard from './OrderItemsCard'

function OrdersByShopsCard({ order }) {
	return (
		<div className='p-4 w-100 bg-light m-2 d-flex flex-column' style={{ minHeight: "100px" }} >
			<b>{order?.shop?.name}</b>
			<div className='d-flex gap-1' >
				{order?.shopOrderItems?.map((item, idx) => (
					<OrderItemsCard key={idx} item={item} />
				))}
			</div>
			<hr />
			<strong>Sub Total: {order.subTotal}</strong>
		</div>
	)
}

export default OrdersByShopsCard