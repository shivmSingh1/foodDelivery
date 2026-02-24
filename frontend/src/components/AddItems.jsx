import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setShopDetails } from '../redux/shopSlice'

function AddItems() {
	const { id } = useParams();
	const [itemDetails, setItemDetails] = useState({
		name: '',
		image: "",
		category: "",
		foodType: "",
		price: ""
	})
	const [frontendImage, setFrontendImage] = useState("")
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const catergoies = [
		"Fast Food",
		"Main Course",
		"Starters",
		"Snacks",
		"Desserts",
		"Beverages",
		"Chinese",
		"Street Food",
		"Sandwiches & Wraps",
		"Breakfast"
	]

	const fetchItemById = async (id) => {
		try {
			const res = await axios.get(`${serverUrl}/item/getItemById/${id}`, { withCredentials: true })
			if (res.status === 200) {
				console.log(res?.data?.data)
				setItemDetails(res?.data?.data)
				setFrontendImage(res?.data?.data?.image)
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
			console.log(error.message)
		}
	}

	useEffect(() => {
		if (id) {
			fetchItemById(id)
		}
	}, [id])

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		let itemImage;
		if (e?.target?.files) {
			itemImage = e.target.files[0]
			const frontendImagePreview = URL.createObjectURL(itemImage)
			console.log(frontendImagePreview)
			setFrontendImage(frontendImagePreview)
		}

		if (name === "image") {
			setItemDetails((prev) => (
				{ ...prev, image: itemImage }
			))
		} else {
			setItemDetails((prev) => (
				{ ...prev, [name]: value }
			))
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			let formdata = new FormData();
			Object.entries(itemDetails).forEach(([key, value]) => (
				formdata.append(key, value)
			))
			let res;
			if (id) {
				res = await axios.put(`${serverUrl}/item/update/${id}`, formdata, { withCredentials: true })
			} else {
				res = await axios.post(`${serverUrl}/item/create`, formdata, { withCredentials: true })
			}
			if (res?.status === 200) {
				dispatch(setShopDetails(res?.data?.data))
				toast.success(res?.data?.message)
				navigate("/")
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<div className='container' >
			<div className='vh-100 d-flex flex-column mb-4 justify-content-center align-items-center' >
				{id ? <h5>Edit item</h5> : <h5>Add Item</h5>}
				<form className='d-flex flex-column border shadow gap-2 p-5 py-4' onSubmit={handleSubmit}>

					<label htmlFor="name">Name</label>
					<input type="text" name="name" onChange={handleChange} value={itemDetails.name} />

					<div className='d-flex flex-column gap-2' >
						<label htmlFor="image">Item Image</label>
						<input type="file" name="image" id="" onChange={handleChange} />
						{frontendImage && <img src={frontendImage} alt="preview" width={100} />}
					</div>

					<label htmlFor="price">Price</label>
					<input type="number" name="price" onChange={handleChange} value={itemDetails?.price} />

					<label htmlFor="category">Category</label>
					<select name="category" id="" onChange={handleChange} value={itemDetails.category} >
						<option value="">Select Cagegory</option>
						{catergoies.map((elem, index) => (
							<option key={index} value={elem}>{elem}</option>
						))}
					</select>

					<label htmlFor="foodType">Food Type</label>
					<select name="foodType" onChange={handleChange} value={itemDetails.foodType}>
						<option value="">Select Type</option>
						<option value="veg">Veg</option>
						<option value="non-veg">Non Veg</option>
					</select>

					<button type='submit' className='btn btn-success' >{id ? "Edit item" : "Add item"}</button>
				</form>
			</div>
		</div>
	)
}

export default AddItems