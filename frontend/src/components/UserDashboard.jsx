import React, { useRef } from 'react'
import Nav from './Nav'
import categories from '../utils/categories'
import CategoryCard from './CategoryCArd'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import UseCurrentCity from '../customHooks/UseCurrentCity';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import { useState } from 'react';
import { useEffect } from 'react';
import FoodItemsCard from './FoodItemsCard';

function UserDashboard() {
	const categoriesRef = useRef()
	const { city } = useSelector(state => state.user)
	const [shopsInCity, setShopsInCity] = useState([])
	const [itemsInCity, setItemsInCity] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null)

	const scrollLeft = () => {
		categoriesRef.current?.scrollBy({
			left: -200,
			behavior: "smooth",
		})
	}

	const scrollRight = () => {
		categoriesRef.current?.scrollBy({
			left: 200,
			behavior: "smooth",
		})
	}

	const fetchShopsInCity = async () => {
		try {
			const res = await axios.get(`${serverUrl}/shop/getShopsByCity?city=${city}`, { withCredentials: true })
			if (res.status === 200) {
				setShopsInCity(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		}
	}

	const fetchItemsInCity = async () => {
		try {
			const res = await axios.get(`${serverUrl}/item/getItemsbyCity?city=${city}`, { withCredentials: true })
			if (res.status === 200) {
				setItemsInCity(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message)
		}
	}

	useEffect(() => {
		if (city) {
			fetchShopsInCity()
			fetchItemsInCity()
		}
	}, [city])

	// Function to get filtered items based on selected category
	const getFilteredItems = () => {
		if (!selectedCategory) {
			return itemsInCity
		}

		// Filter shops and their items by the selected category
		return itemsInCity?.map(shop => ({
			...shop,
			items: shop?.items?.filter(item =>
				item?.category?.toLowerCase() === selectedCategory?.name?.toLowerCase()
			)
		})).filter(shop => shop?.items?.length > 0)
	}

	return (
		<div className="container">
			<Nav isUser={true} isOwner={false} isDeliveryBoy={false} />
			<div className="d-flex flex-column align-items-center mt-4">
				<div
					className="position-relative mb-4"
					style={{ width: "500px", height: "130px" }}
				>
					<h5>Inspiration for your first order</h5>
					{/* Scrollable Row */}
					<div
						ref={categoriesRef}
						className="d-flex gap-2 overflow-auto hide-scrollbar smooth-scroll h-100"
					>
						{categories?.map((category, index) => (
							<div
								key={index}
								onClick={() => setSelectedCategory(selectedCategory?.name === category?.name ? null : category)}
								style={{
									cursor: "pointer",
									opacity: selectedCategory?.name === category?.name ? 1 : 0.6,
									border: selectedCategory?.name === category?.name ? "2px solid #007bff" : "none",
									borderRadius: "8px",
									padding: selectedCategory?.name === category?.name ? "4px" : "0px",
									transition: "all 0.3s ease"
								}}
							>
								<CategoryCard category={category} />
							</div>
						))}
					</div>

					{/* Left Arrow */}
					<span
						className="position-absolute top-50 start-0 arrow-btn"
						onClick={scrollLeft}
					>
						<IoIosArrowBack size={30} />
					</span>

					{/* Right Arrow */}
					<span
						className="position-absolute top-50 end-0 arrow-btn"
						onClick={scrollRight}
					>
						<IoIosArrowForward size={30} />
					</span>
				</div>

				<div
					className="position-relative mt-5 mb-4"
					style={{ width: "500px", height: "130px" }}
				>
					<h5>Best shops in {city}</h5>
					<div
						className="d-flex gap-2 overflow-auto hide-scrollbar smooth-scroll h-100"
					>
						{shopsInCity?.map((shop, index) => (
							<CategoryCard key={index} category={shop} />
						))}
					</div>
				</div>

				<div
					className=" mt-5 mb-5"
					style={{ width: "500px" }}
				>
					<h5>Suggested food items {selectedCategory && `- ${selectedCategory?.name}`}</h5>
					<div
						className="d-flex gap-2"
					>
						{getFilteredItems()?.map((item, index) => (
							// <FoodItemsCard key={index} item={item} />
							item?.items?.map((i, index) => (
								<FoodItemsCard key={index} item={i} />
							))
						))}
					</div>
				</div>

			</div>
		</div>
	)
}

export default UserDashboard