import React, { useEffect } from 'react'
import Nav from './Nav'
import { toast } from 'react-toastify'
import UseGetShops from '../customHooks/UseGetShops'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import ItemCard from './ItemCard'

function OwnerDashboard() {
	UseGetShops()
	const { shopDetails } = useSelector(state => state.Shop)
	const navigate = useNavigate()
	if (shopDetails.length <= 0) {
		return (
			<div className='container' >
				<Nav isUser={false} isOwner={true} />
				<div className='d-flex justify-content-center mt-5' >
					<span className='d-flex justify-content-center align-items-center flex-column border shadow p-2 py-4' >
						<h4 className='mb-1' >Add Your Restaurant</h4>
						<p className='pb-0 mb-0' >Join our food delivery platform</p>
						<p className='mb-2' >and reach thousand of customers everyday.</p>
						<button className='btn btn-primary' onClick={() => navigate("/create-edit-shop")} >Get started</button>
					</span>
				</div>
			</div>
		)
	}
	return (
		<div className='container'>
			<Nav isUser={false} isOwner={true} />
			<div>
				<div className='d-flex flex-column align-items-center mt-4' >
					<h4 className='text-center mb-3' >Welcome to {shopDetails?.[0]?.name}</h4>
					<div className='border p-2 py-3 shadow' style={{ minWidth: "500px" }} >
						<div style={{ backgroundColor: "grey" }} className=' d-flex justify-content-center mb-2 position-relative ' >
							<img src={shopDetails?.[0]?.image} alt="" height={150} style={{ objectFit: "cover" }} />
							<span className='position-absolute top-0' onClick={() => navigate("/create-edit-shop")} ><FaEdit size={20} /></span>
						</div>
						<p className='mb-0' ><strong >{shopDetails?.[0]?.name}</strong></p>
						<p className='mb-0'>{shopDetails?.[0]?.city},{shopDetails?.[0]?.state}</p>
						<p>{shopDetails?.[0]?.address}</p>
					</div>
				</div>

				{
					(shopDetails?.[0]?.items.length <= 0) && (
						<div className='d-flex justify-content-center mt-5' >
							<span className='d-flex justify-content-center align-items-center flex-column border shadow p-2 py-4' >
								<h4 className='mb-1' >Add Food items</h4>
								<p className='pb-0 mb-0' >Share your delicious creations</p>
								<p className='mb-2' >with our customers by adding them.</p>
								<button className='btn btn-primary' onClick={() => navigate("/add-item")} >Get started</button>
							</span>
						</div>
					)
				}

				{
					(shopDetails?.[0]?.items.length > 0) && (
						<div className='mt-3 d-flex flex-wrap justify-content-between' >
							{
								shopDetails?.[0]?.items.map((item, index) => (
									<ItemCard key={index} item={item} />
								))
							}
						</div>
					)
				}

			</div>
		</div>
	)
}

export default OwnerDashboard