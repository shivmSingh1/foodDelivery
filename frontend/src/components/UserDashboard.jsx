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
				setItemsInCity(res?.data?.data?.[0]?.items)
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

	return (
		<div className="container">
			<Nav isUser={true} isOwner={false} />
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
							<CategoryCard key={index} category={category} />
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
					<h5>Suggested food items</h5>
					<div
						className="d-flex gap-2"
					>
						{itemsInCity?.map((item, index) => (
							<FoodItemsCard key={index} item={item} />
						))}
					</div>
				</div>

			</div>
		</div>
	)
}

export default UserDashboard