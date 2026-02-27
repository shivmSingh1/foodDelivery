import React, { useEffect, useState } from 'react'
import { IoArrowBack, IoSearchCircle } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Map from './Map';
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import getCurrentLocation from '../utils/getCurrentLocation';
import AddressInput from './AddressInput';
import getAddress from '../utils/getAddressByLatLng';
import { toast } from 'react-toastify';

function Checkout() {
	const { location, address } = useSelector((state) => state.Map)
	const [deliveryAddress, setDeliveryAddress] = useState(null)
	const dispatch = useDispatch()

	useEffect(() => {
		if (address) {
			setDeliveryAddress(address)
		}
	}, [address])

	const handleChange = (e) => {
		setDeliveryAddress(e.target.value)
	}


	const setNewLocation = async (location) => {
		const apikey = import.meta.env.VITE_GEO_APIKEY
		const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${location?.lat}&lon=${location?.long}&apiKey=${apikey}`)
		const address = res?.data?.features?.[0]?.properties?.formatted
		// dispatch(setAddress(address))
		setDeliveryAddress(address)
	}

	const handleCurrentLocation = async () => {
		const location = await getCurrentLocation()
		dispatch(setLocation({ lat: location?.lat, long: location?.long }))
		setNewLocation(location)
	}

	const handleSearch = async () => {
		const location = await getAddress(deliveryAddress)
		if (!location?.lat || !location?.long) {
			toast.error("This address is not accepted, Please enter a valid address")
			return null
		}
		dispatch(setLocation(location))
	}

	return (
		<div className='container' >
			<span className='mt-4' onClick={() => navigate(-1)} ><IoArrowBack size={25} /></span>
			<div className='d-flex justify-content-center mt-5'  >
				<div className='border p-4' style={{ minWidth: "500px" }} >
					<h4>Checkout</h4>
					<p><FaLocationDot /> delivery location</p>
					<div className='d-flex gap-1 align-items-center' >
						<input type="text" className='w-100' value={deliveryAddress} onChange={handleChange} />
						<span className='bg-danger rounded p-1 px-2' onClick={handleSearch} ><FaSearch /></span>
						<span className='bg-primary rounded p-1 px-2' onClick={handleCurrentLocation} ><TbCurrentLocation /></span>
					</div>
					<div className='overflow-hidden p-2 border mt-3' style={{ height: "300px", width: "500px" }} >
						{
							(location?.lat && location?.long) && (
								<Map location={location} setNewLocation={setNewLocation} />
							)
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout