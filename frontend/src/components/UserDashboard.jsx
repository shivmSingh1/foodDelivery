import React, { useRef, useEffect, useState } from 'react'
import Nav from './Nav'
import categories from '../utils/categories'
import CategoryCard from './CategoryCard'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import FoodItemsCard from './FoodItemsCard';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {

	const categoriesRef = useRef()

	const { city, searchResults } = useSelector(state => state.user)

	const [shopsInCity, setShopsInCity] = useState([])
	const [itemsInCity, setItemsInCity] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null)

	const navigate = useNavigate()

	// 🔥 API Calls
	const fetchShopsInCity = async () => {
		try {
			const res = await axios.get(`${serverUrl}/shop/getShopsByCity?city=${city}`, { withCredentials: true })
			if (res.status === 200) setShopsInCity(res.data.data)
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	const fetchItemsInCity = async () => {
		try {
			const res = await axios.get(`${serverUrl}/item/getItemsbyCity?city=${city}`, { withCredentials: true })
			if (res.status === 200) setItemsInCity(res.data.data)
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		if (city) {
			fetchShopsInCity()
			fetchItemsInCity()
		}
	}, [city])

	// 🔥 Filter Logic
	const getFilteredItems = () => {
		if (!selectedCategory) return itemsInCity

		return itemsInCity
			.map(shop => ({
				...shop,
				items: shop.items.filter(item =>
					item.category?.toLowerCase() === selectedCategory.name.toLowerCase()
				)
			}))
			.filter(shop => shop.items.length > 0)
	}

	// 🔥 Scroll
	const scrollLeft = () => {
		categoriesRef.current?.scrollBy({ left: -200, behavior: "smooth" })
	}

	const scrollRight = () => {
		categoriesRef.current?.scrollBy({ left: 200, behavior: "smooth" })
	}

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<Nav isUser={true} />

			<div className="container-fluid px-3 px-md-4 py-3">

				{/* 🔍 SEARCH RESULTS */}
				{searchResults?.length > 0 && (
					<div className="mb-4">

						<h5 className="fw-bold mb-3">Search Results</h5>

						<div className="row g-3">
							{searchResults.map(item => (
								<div key={item._id} className="col-6 col-md-4 col-lg-3">
									<FoodItemsCard item={item} />
								</div>
							))}
						</div>

					</div>
				)}

				{/* 🔥 MAIN CONTENT */}
				{searchResults?.length === 0 && (
					<>

						{/* 🍱 Categories */}
						<div className="mb-4 position-relative">

							<h5 className="fw-bold mb-3">Inspiration for your first order</h5>

							<div
								ref={categoriesRef}
								className="d-flex gap-3 overflow-auto pb-2"
							>
								{categories.map((category, index) => (
									<div
										key={index}
										onClick={() =>
											setSelectedCategory(
												selectedCategory?.name === category.name ? null : category
											)
										}
										style={{
											cursor: "pointer",
											opacity: selectedCategory?.name === category.name ? 1 : 0.6,
											transform: selectedCategory?.name === category.name ? "scale(1.05)" : "scale(1)",
											transition: "0.3s"
										}}
									>
										<CategoryCard category={category} />
									</div>
								))}
							</div>

							{/* Arrows (Desktop Only) */}
							<button
								className="btn btn-light position-absolute top-50 start-0 d-none d-md-block"
								onClick={scrollLeft}
							>
								<IoIosArrowBack />
							</button>

							<button
								className="btn btn-light position-absolute top-50 end-0 d-none d-md-block"
								onClick={scrollRight}
							>
								<IoIosArrowForward />
							</button>

						</div>

						{/* 🏪 Shops */}
						<div className="mb-4">

							<h5 className="fw-bold mb-3">Best shops in {city}</h5>

							<div className="row g-3">
								{shopsInCity.map(shop => (
									<div
										key={shop._id}
										className="col-4 col-md-3 col-lg-2"
										onClick={() => navigate(`/shop/${shop._id}`)}
										style={{ cursor: "pointer" }}
									>
										<CategoryCard category={shop} />
									</div>
								))}
							</div>

						</div>

						{/* 🍔 Food Items */}
						<div>

							<h5 className="fw-bold mb-3">
								Suggested Food {selectedCategory && `- ${selectedCategory.name}`}
							</h5>

							<div className="row g-3">

								{getFilteredItems()?.map(shop =>
									shop.items.map(item => (
										<div key={item._id} className="col-6 col-md-4 col-lg-3">
											<FoodItemsCard item={item} />
										</div>
									))
								)}

							</div>

						</div>

					</>

				)}

			</div>
		</div>
	)
}

export default UserDashboard