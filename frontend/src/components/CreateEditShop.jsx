import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import UseGetShops from '../customHooks/UseGetShops'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import { useLoader } from '../customHooks/useLoader';

function CreateEditShop() {

	UseGetShops()

	const { shopDetails } = useSelector(state => state.Shop)
	const navigate = useNavigate()
	const { showLoader, hideLoader } = useLoader()

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

	// 🔥 Handle Change
	const handleChange = (e) => {
		const { name, value, files } = e.target

		if (files) {
			const file = files[0]
			setFrontendImage(URL.createObjectURL(file))
			setShopInfo(prev => ({ ...prev, image: file }))
		} else {
			setShopInfo(prev => ({ ...prev, [name]: value }))
		}
	}

	// 🔥 Submit
	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			showLoader('Saving shop details...')
			let formData = new FormData()

			Object.entries(shopInfo).forEach(([key, value]) => {
				formData.append(key, value)
			})

			const res = await axios.post(
				`${serverUrl}/shop/create-update`,
				formData,
				{ withCredentials: true }
			)

			if (res.status === 200) {
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
					<IoArrowBack
						size={22}
						style={{ cursor: "pointer" }}
						onClick={() => navigate(-1)}
					/>
					<h5 className="fw-bold m-0">
						{shopDetails.length > 0 ? "Edit Shop" : "Create Shop"}
					</h5>
				</div>

				{/* 🔥 Form Card */}
				<div
					className="bg-white p-3 p-md-4 rounded shadow-sm mx-auto"
					style={{ maxWidth: "500px" }}
				>

					<form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

						{/* Name */}
						<div>
							<label className="form-label small fw-semibold">Shop Name</label>
							<input
								type="text"
								name="name"
								className="form-control"
								value={shopInfo.name}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Image */}
						<div>
							<label className="form-label small fw-semibold">Shop Image</label>
							<input
								type="file"
								name="image"
								className="form-control"
								onChange={handleChange}
							/>

							{(frontendImage || shopInfo?.image) && (
								<img
									src={frontendImage || shopInfo?.image}
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

						{/* City + State */}
						<div className="row">
							<div className="col-6">
								<label className="form-label small fw-semibold">City</label>
								<input
									type="text"
									name="city"
									className="form-control"
									value={shopInfo.city}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="col-6">
								<label className="form-label small fw-semibold">State</label>
								<input
									type="text"
									name="state"
									className="form-control"
									value={shopInfo.state}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						{/* Address */}
						<div>
							<label className="form-label small fw-semibold">Address</label>
							<input
								type="text"
								name="address"
								className="form-control"
								value={shopInfo.address}
								onChange={handleChange}
								required
							/>
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
							Save Changes
						</button>

					</form>

				</div>

			</div>
		</div>
	)
}

export default CreateEditShop