import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setSearchResults, setUserDetails } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav({ isUser, isOwner, isDeliveryBoy }) {

	const { userDetails, cart, city } = useSelector(state => state.user)
	const { shopDetails } = useSelector(state => state.Shop)

	const [showLogoutBox, setShowLogoutBox] = useState(false)
	const [searchQuery, setSearchQuery] = useState("");

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			const res = await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true })
			if (res.status === 200) {
				dispatch(setUserDetails(null))
				navigate("/signin")
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	useEffect(() => {
		const delayDebounce = setTimeout(async () => {

			if (!searchQuery.trim()) {
				dispatch(setSearchResults([]));
				return;
			}

			try {
				const res = await axios.get(
					`${serverUrl}/item/search-item?query=${searchQuery}&city=${city}`,
					{ withCredentials: true }
				);

				if (res.status === 200) {
					dispatch(setSearchResults(res.data.items));
				}
			} catch (error) {
				console.log(error.message);
			}

		}, 500);

		return () => clearTimeout(delayDebounce);

	}, [searchQuery, city]);

	return (
		<nav
			className="sticky-top"
			style={{
				background: "rgba(255,255,255,0.9)",
				backdropFilter: "blur(12px)",
				borderBottom: "1px solid #eee",
				zIndex: 1000
			}}
		>

			<div className="container-fluid py-2">

				{/* 🔥 TOP ROW */}
				<div className="d-flex align-items-center justify-content-between">

					{/* Logo */}
					<h4
						className="fw-bold m-0"
						style={{ color: "#FF4D4F", cursor: "pointer" }}
						onClick={() => navigate("/")}
					>
						FoodDelivery
					</h4>

					{/* Right icons (mobile + desktop) */}
					<div className="d-flex align-items-center gap-3">

						{/* Cart */}
						{
							isUser && (
								<div
									className="position-relative"
									onClick={() => navigate('/cart')}
									style={{ cursor: "pointer" }}
								>
									<CiShoppingCart size={26} />
									<span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
										{cart?.length || 0}
									</span>
								</div>
							)
						}

						{/* Profile */}
						<div className="position-relative">

							<div
								className="rounded-circle d-flex align-items-center justify-content-center text-white"
								style={{
									width: "34px",
									height: "34px",
									background: "linear-gradient(135deg,#FF4D4F,#ff7a7c)",
									cursor: "pointer",
									fontWeight: "600"
								}}
								onClick={() => setShowLogoutBox(!showLogoutBox)}
							>
								{userDetails?.fullname?.charAt(0)?.toUpperCase()}
							</div>

							{
								showLogoutBox && (
									<div
										className="position-absolute bg-white shadow mt-2"
										style={{
											right: 0,
											borderRadius: "10px",
											padding: "10px",
											minWidth: "140px",
											zIndex: "11"
										}}
									>
										<p className="m-0 small fw-semibold">
											{userDetails?.fullname}
										</p>
										<hr className="my-2" />
										<p
											className="text-danger m-0 small"
											style={{ cursor: "pointer" }}
											onClick={handleLogout}
										>
											Logout
										</p>
									</div>
								)
							}
						</div>

					</div>
				</div>

				{/* 🔍 SECOND ROW (Search + Location) */}
				{
					isUser && (
						<div className="mt-2">

							{/* Location */}
							<div className="d-flex align-items-center gap-1 small text-muted mb-1">
								<FaLocationDot color="#FF4D4F" />
								<span>{city || "Select city"}</span>
							</div>

							{/* Search */}
							<div className="position-relative">

								<IoSearchSharp
									className="position-absolute"
									style={{
										top: "50%",
										left: "12px",
										transform: "translateY(-50%)",
										color: "#999"
									}}
								/>

								<input
									type="text"
									className="form-control ps-5"
									placeholder="Search food, restaurants..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									style={{
										borderRadius: "12px",
										border: "1px solid #eee",
										padding: "10px"
									}}
								/>
							</div>
						</div>
					)
				}

				{/* 🔥 OWNER / DELIVERY LINKS (mobile friendly) */}
				<div className="d-flex gap-3 mt-2 small flex-wrap">

					{
						isOwner && shopDetails.length > 0 && (
							<>
								<span onClick={() => navigate("/add-item")} style={{ cursor: "pointer" }}>
									Add Items
								</span>
								<span onClick={() => navigate('/owner-orders')} style={{ cursor: "pointer" }}>
									My Orders
								</span>
							</>
						)
					}

					{
						isDeliveryBoy && (
							<span onClick={() => navigate('/owner-orders')} style={{ cursor: "pointer" }}>
								My Orders
							</span>
						)
					}

				</div>

			</div>
		</nav>
	)
}

export default Nav