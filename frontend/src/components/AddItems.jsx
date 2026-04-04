import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setShopDetails } from '../redux/shopSlice'
import { IoArrowBack } from "react-icons/io5";
import { useLoader } from '../customHooks/useLoader';

function AddItems() {

	const { id } = useParams()

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
	const { showLoader, hideLoader } = useLoader()

	const categories = [
		"Fast Food", "Main Course", "Starters", "Snacks",
		"Desserts", "Beverages", "Chinese", "Street Food",
		"Sandwiches & Wraps", "Breakfast"
	]

	// 🔥 Fetch item
	const fetchItemById = async (id) => {
		try {
			showLoader('Loading item...')
			const res = await axios.get(`${serverUrl}/item/getItemById/${id}`, { withCredentials: true })
			if (res.status === 200) {
				setItemDetails(res.data.data)
				setFrontendImage(res.data.data.image)
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			hideLoader()
		}
	}

	useEffect(() => {
		if (id) fetchItemById(id)
	}, [id])

	// 🔥 Change
	const handleChange = (e) => {
		const { name, value, files } = e.target

		if (files) {
			const file = files[0]
			setFrontendImage(URL.createObjectURL(file))
			setItemDetails(prev => ({ ...prev, image: file }))
		} else {
			setItemDetails(prev => ({ ...prev, [name]: value }))
		}
	}

	// 🔥 Submit
	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			showLoader(id ? 'Updating item...' : 'Adding item...')
			let formdata = new FormData()

			Object.entries(itemDetails).forEach(([key, value]) => {
				formdata.append(key, value)
			})

			let res

			if (id) {
				res = await axios.put(`${serverUrl}/item/update/${id}`, formdata, { withCredentials: true })
			} else {
				res = await axios.post(`${serverUrl}/item/create`, formdata, { withCredentials: true })
			}

			if (res?.status === 200) {
				dispatch(setShopDetails(res.data.data))
				toast.success(res.data.message)
				navigate("/")
			}

		} catch (error) {
			toast.error(error?.response?.data?.message)
		} finally {
			hideLoader()
		}
	}

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔙 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoArrowBack size={22} style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
					<h5 className="fw-bold m-0">
						{id ? "Edit Item" : "Add New Item"}
					</h5>
				</div>

				{/* 🔥 Form Card */}
				<div className="bg-white p-3 p-md-4 rounded shadow-sm mx-auto"
					style={{ maxWidth: "500px" }}
				>

					<form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

						{/* Name */}
						<div>
							<label className="form-label small fw-semibold">Item Name</label>
							<input
								type="text"
								name="name"
								className="form-control"
								value={itemDetails.name}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Image */}
						<div>
							<label className="form-label small fw-semibold">Item Image</label>
							<input
								type="file"
								name="image"
								className="form-control"
								onChange={handleChange}
							/>

							{frontendImage && (
								<img
									src={frontendImage}
									alt="preview"
									className="mt-2"
									style={{
										width: "100px",
										height: "100px",
										objectFit: "cover",
										borderRadius: "10px"
									}}
								/>
							)}
						</div>

						{/* Price */}
						<div>
							<label className="form-label small fw-semibold">Price</label>
							<input
								type="number"
								name="price"
								className="form-control"
								value={itemDetails.price}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Category */}
						<div>
							<label className="form-label small fw-semibold">Category</label>
							<select
								name="category"
								className="form-select"
								value={itemDetails.category}
								onChange={handleChange}
								required
							>
								<option value="">Select Category</option>
								{categories.map((c, i) => (
									<option key={i} value={c}>{c}</option>
								))}
							</select>
						</div>

						{/* Food Type */}
						<div>
							<label className="form-label small fw-semibold">Food Type</label>
							<select
								name="foodType"
								className="form-select"
								value={itemDetails.foodType}
								onChange={handleChange}
								required
							>
								<option value="">Select Type</option>
								<option value="veg">Veg</option>
								<option value="non-veg">Non Veg</option>
							</select>
						</div>

						{/* Submit */}
						<button
							type="submit"
							className="btn w-100 mt-2"
							style={{
								background: "#FF4D4F",
								color: "#fff",
								borderRadius: "10px"
							}}
						>
							{id ? "Update Item" : "Add Item"}
						</button>

					</form>

				</div>

			</div>
		</div>
	)
}

export default AddItems