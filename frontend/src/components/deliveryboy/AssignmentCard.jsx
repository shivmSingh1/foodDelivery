import axios from 'axios'
import React from 'react'
import { serverUrl } from '../../App'
import { toast } from 'react-toastify'

function AssignmentCard({ assign, fetchCurrentOrder }) {
	// console.log('assign', assign)
	const acceptOrder = async (assignmentId) => {
		try {
			const res = await axios.get(`${serverUrl}/order/accept-order/${assignmentId}`, { withCredentials: true })
			if (res.status === 200) {
				await fetchCurrentOrder()
				toast.success(res?.data?.message)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<div className='border p-2 rounded d-flex' >
			<div>
				<h6 >{assign?.shopname}</h6>
				<p className='pb-0 mb-0' >Delivery Address : {assign?.deliveryAddress.text}</p>
				<small>{assign?.items.length} items | rs: {assign?.subTotal}</small>
			</div>
			<div className='d-flex align-items-center justify-content-center p-2' >
				<button className='btn btn-warning' onClick={() => acceptOrder(assign?.assignmentId)} >Accept</button>
			</div>
		</div>
	)
}

export default AssignmentCard