import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import UseGetShops from '../customHooks/UseGetShops'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'

function CreateEditShop() {
	UseGetShops()
	const { shopDetails } = useSelector(state => state.Shop)
	const navigate = useNavigate()
	const [shopInfo, setShopInfo] = useState({
		name: "",
		image: "",
		city: "",
		state: "",
		address: ""
	})
	const [frontendImage, setFrontendImage] = useState(null)

	useEffect(() => {
		if (shopDetails.length > 0) {
			setShopInfo(shopDetails[0])
		}
	}, [shopDetails])

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		let shopImage = null;
		let shopImageUrl = "";

		if (e?.target?.files) {
			shopImage = e.target.files[0]
			shopImageUrl = URL.createObjectURL(shopImage)
			setFrontendImage(shopImageUrl)
		}

		if (name === "image") {
			setShopInfo((prev) => (
				{ ...prev, image: shopImage }
			))
		} else {
			setShopInfo((prev) => (
				{ ...prev, [name]: value }
			))
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			let formData = new FormData()
			Object.entries(shopInfo).forEach(([key, value]) => {
				formData.append(key, value);
			});
			const res = await axios.post(`${serverUrl}/shop/create-update`, formData, { withCredentials: true })
			if (res.status === 200) {
				toast.success(res?.data?.message)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<div className='container vh-100' >
			<div onClick={() => navigate(-1)} ><IoArrowBack size={30} /></div>
			<div className='d-flex vh-100 justify-content-center align-items-center' >
				<form className='p-3 py-4 border shadow d-flex flex-column gap-2' onSubmit={handleSubmit} >
					<h5 className='mb-2 text-center' >{shopDetails.length > 0 ? "Edit" : "Add"}&nbsp;Shop</h5>

					<label htmlFor="name">Full Name</label>
					<input type="text" name="name" id="" value={shopInfo?.name} onChange={handleChange} />

					<label htmlFor="image">Shop Image
						<input type="file" className='ms-2' name="image" id="image" onChange={handleChange} />
					</label>
					{(frontendImage || shopInfo?.image) && <img src={frontendImage ? frontendImage : shopDetails?.[0]?.image} alt="shop-image" height={100} width={100} />}

					<div>
						<label htmlFor="city" className='me-1' >City</label>
						<input type="text" name="city" id="city" value={shopInfo.city} onChange={handleChange} />
						<label className='ms-2 me-1' htmlFor="state">State</label>
						<input type="text" name="state" id="state" value={shopInfo?.state} onChange={handleChange} />
					</div>

					<label htmlFor="address">Shop Address</label>
					<input type="text" name="address" value={shopInfo?.address} id="address" onChange={handleChange} />

					<button type='submit' className='btn btn-success' >Save</button>
				</form>
			</div>
		</div>
	)
}

export default CreateEditShop