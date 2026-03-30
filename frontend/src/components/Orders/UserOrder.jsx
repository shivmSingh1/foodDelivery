import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { serverUrl, socket } from '../../App';
import OrdersByShopsCard from './OrdersByShopsCard';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaRupeeSign } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function UserOrder() {
	const [orders, setOrders] = useState({})
	const navigate = useNavigate()
	const getUserOrder = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getOrders`, { withCredentials: true })
			console.log(res?.data?.data)
			setOrders(res?.data?.data)
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		getUserOrder()
	}, [])

	useEffect(() => {
		const handleUpdate = (data) => {
			if (data.type === "ORDER_STATUS_UPDATED") {
				setOrders(prev => ({
					...prev,
					order: prev.order.map(o =>
						o._id === data.orderId
							? { ...o, status: data.status }
							: o
					)
				}))
			}
		};

		socket.on("order:status:update", handleUpdate);

		return () => {
			socket.off("order:status:update", handleUpdate);
		};
	}, []);

	return (
		<div className='container' >
			<IoMdArrowRoundBack className='mt-4' size={25} onClick={() => navigate(-1)} />
			{
				orders && (
					<div className='w-100' >
						{
							orders?.order?.map((od, idx) => (
								<OrdersByShopsCard key={idx} order={od} />
							))
						}
					</div>
				)
			}
		</div>
	)
}

export default UserOrder