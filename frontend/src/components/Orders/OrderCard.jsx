import React, { useEffect } from 'react'
import OrderItemsCard from './OrderItemsCard'
import Select from 'react-select'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl, socket } from '../../App'

function OrderCard({ order }) {
	console.log("sdfsfsfsfsddfsdfs", order)
	const [status, setStatus] = useState({ value: order?.status, label: order?.status })
	const [availableBoys, setAvailableBoys] = useState([])
	const options = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'preparing', label: 'Preparing' },
		{ value: "out for delivery", label: 'Out For delivery' },
		{ value: 'delivered', label: 'Delivered' }
	]

	const setOrderStatus = async (value) => {
		try {
			const res = await axios.post(`${serverUrl}/order/updateOrderStatus`, { status: value, orderId: order._id, shopId: order?.shopOrder?.[0]?.shop?._id || order?.shopOrder?.[0]?.shop }, { withCredentials: true })
			if (res.status === 200) {
				toast.success(res?.data?.message)
				setAvailableBoys(res?.data?.data?.availableBoys)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}
	const handleStatusChange = (e) => {
		setStatus(e)
		setOrderStatus(e.value)
	}



	return (
		<div className='border p-4 mb-3' >
			<h5 className='mb-0 pb-0' >{order?.user?.fullname}</h5>
			<p className='mb-0 pb-0'>	<small >{order?.user?.email}</small></p>
			<p className='mb-0 pb-0' ><small >{order?.user?.mobile}</small></p>
			<p>{order?.paymentMethod !== "cod" ? <div className='d-flex flex-column' >
				<small>Payment method: {order?.paymentMethod}</small>
				<small>Payment Status: {order?.payment ? "True" : "False"}</small>
			</div> : <small>Payment method: {order?.paymentMethod}</small>}</p>
			<p>{order?.deliveryAddress?.text}</p>
			<div className='d-flex gap-1' >
				{
					order?.shopOrder?.[0]?.shopOrderItems?.map((item, idx) => (
						<OrderItemsCard key={idx} item={item} />
					))
				}
			</div>
			<div className='d-flex justify-content-between' >
				<h6>Status: <span className='text-danger' >{status && status.value}</span></h6>
				<div style={{ width: "300px" }} ><Select options={options} value={status} onChange={handleStatusChange} /></div>
			</div>
			<div>
				{
					status && status.value === "out for delivery" && (
						<div>
							<p>{order?.shopOrder?.[0]?.assignedDeliveryBoy ? (
								<p>Assignd delivery Boy {order?.shopOrder?.[0]?.assignedDeliveryBoy}</p>
							) : <p>Availabe delivery boy</p>}</p>
							{
								availableBoys.length > 0 && (
									availableBoys.map((deliveryBoy) => (
										<p>{deliveryBoy.fullname}</p>
									))
								)
							}
						</div>
					)
				}
			</div>
		</div>
	)
}

export default OrderCard