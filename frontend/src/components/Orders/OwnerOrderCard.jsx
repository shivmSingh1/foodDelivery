import React from 'react'
import { serverUrl, socket } from '../../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useState } from 'react'
import OrderCard from './OrderCard'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function OwnerOrderCard() {
	const [myOrders, setMyOrders] = useState([])
	// const { socket } = useSelector((state) => state.user)
	const navigate = useNavigate()
	const getOwnerOrders = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getOwnerOrder`, { withCredentials: true })
			if (res.status === 200) {
				setMyOrders(res?.data?.data)
				console.log(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}
	useEffect(() => {
		getOwnerOrders()
	}, [])

	useEffect(() => {
		socket.on("newOrder", (data) => {
			console.log("new orderrrrrrrrrrrrrrr", data)
			setMyOrders((prev) => [data, ...prev])
		})

		return () => {
			socket.off("newOrder")
		}
	}, [])

	return (
		<div className='container p-4' >
			<IoMdArrowRoundBack size={25} onClick={() => navigate(-1)} />
			<h5>My Orders</h5>
			<div>
				{
					myOrders?.map((order, idx) => (
						<OrderCard key={idx} order={order} />
					))
				}
			</div>
		</div>
	)
}

export default OwnerOrderCard