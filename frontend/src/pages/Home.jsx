import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import DeliveryBoyDashboard from '../components/deliveryBoyDashboard'
import OwnerDashboard from '../components/ownerDashboard'

function Home() {
	const { userDetails } = useSelector(state => state.user)
	return (
		<div className='container' >
			{
				userDetails?.role === "user" && <UserDashboard />
			}
			{
				userDetails?.role === "deliveryBoy" && <DeliveryBoyDashboard />
			}
			{
				userDetails?.role === "owner" && <OwnerDashboard />
			}
		</div>
	)
}

export default Home