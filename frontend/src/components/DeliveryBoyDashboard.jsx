import React from 'react'
import Nav from './Nav'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl } from '../App'
import { useState } from 'react'
import AssignmentCard from './deliveryboy/AssignmentCard'
import DeliveryboyTraking from './deliveryboy/DeliveryboyTraking'


function DeliveryBoyDashboard() {
	const { userDetails } = useSelector((state) => state.user)
	const [assignment, setAssignments] = useState([])
	const [currentOrder, setCurrentOrder] = useState(null)

	const fetchAssignments = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/get-assignment`, { withCredentials: true })
			if (res.status == 200) {
				toast.success("assignment fetched");
				setAssignments(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message)
		}
	}

	const fetchCurrentOrder = async () => {
		try {
			const res = await axios.get(`${serverUrl}/order/getCurrentOrder`, { withCredentials: true })
			if (res.status === 200) {
				console.log("current order", res)
				setCurrentOrder(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		fetchCurrentOrder()
		fetchAssignments()
	}, [userDetails])

	useEffect(() => {
		console.log("assignment", assignment)
	}, [assignment])

	return (
		<div className='container' >
			<Nav isOwner={false} isUser={false} isDeliveryBoy={true} />
			<div className='d-flex align-items-center mt-2 flex-column' >
				<div className='border shadow-md p-3 d-flex align-items-center flex-column w-50' >
					<h5>Welcome {userDetails?.fullname}</h5>
					<p>Lat:{userDetails?.location?.coordinates[1]}&nbsp;Lon:{userDetails?.location?.coordinates[0]}</p>
				</div>
				<div className='border shadow-md p-3 d-flex align-items-center flex-column mt-2 w-50' >
					<h5>Available orders</h5>
					<div className='d-flex flex-column gap-2 p-2' >
						{
							assignment && (
								assignment.map((assign, index) => (
									<AssignmentCard key={index} fetchCurrentOrder={fetchCurrentOrder} assign={assign} />
								))
							)
						}
					</div>
				</div>
				{
					currentOrder && (
						<div className='border shadow-md p-3 d-flex align-items-center flex-column mt-2 w-50' >
							<h5>Current order</h5>
							<div className='d-flex flex-column gap-2 p-2' >
								<p>{currentOrder?.shopOrder?.shop?.name}</p>
								<p>{currentOrder?.deliveryAddress?.text}</p>
								<p>{currentOrder?.shopOrder?.shopOrderItems?.length} items | {currentOrder.shopOrder?.subTotal}</p>
							</div>
							<div style={{ width: "400px" }} >
								<DeliveryboyTraking currentOrder={currentOrder} />
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
}

export default DeliveryBoyDashboard