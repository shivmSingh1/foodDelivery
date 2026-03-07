import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import OrdersByShopsCard from './OrdersByShopsCard';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaRupeeSign } from 'react-icons/fa';

function UserOrder() {
	const [orders, setOrders] = useState({})
	const getUserOrder = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getOrders`, { withCredentials: true })
			// console.log(res?.data?.data)
			setOrders(res?.data?.data)
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		getUserOrder()
	}, [])
	return (
		<div className='container' >
			{
				orders && (
					<div className='p-5' >
						<div>
							<h6 className='pb-0 mb-0' >Order #{orders?.id}</h6>
							<small>Date: {new Date(orders?.date).toLocaleDateString("en-GB", {
								day: "numeric",
								month: "short",
								year: "numeric"
							})}</small>
							<hr />
							<div >
								{
									orders?.order?.map((od, idx) => (
										<OrdersByShopsCard key={idx} order={od} />
									))
								}
							</div>
							<strong><hr /></strong>
							<div className='p-2 d-flex align-items-center justify-content-between' >
								<h4>Total: <FaRupeeSign />{orders?.totalAmount}</h4>
								<button className='btn btn-success' >Track Order</button>
							</div>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default UserOrder