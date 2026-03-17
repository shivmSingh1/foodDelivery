import React from 'react'

function OrderItemsCard({ item }) {
	return (
		<div style={{ maxWidth: "150px", height: "160px" }} className='p-2 d-flex gap-1' >
			<div className='d-flex flex-column border rounded p-2' >
				<img src={item?.image} alt={item?.name} width={"100%"} className='rounded' height={"70px"} />
				<div>
					<p className='mb-0 pb-0' >{item?.name}</p>
					<small>{item?.quantity} x {item?.price}</small>
				</div>
			</div>
		</div>
	)
}

export default OrderItemsCard