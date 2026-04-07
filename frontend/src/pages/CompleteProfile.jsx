import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import { useLoader } from "../customHooks/useLoader";
import { toast } from 'react-toastify';
import { IoArrowBack } from "react-icons/io5";
import useCurrentUser from "../customHooks/useCurrentUser";

function CompleteProfile() {
	useCurrentUser()
	const { userDetails } = useSelector((state) => state.user)
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [role, setRole] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showLoader, hideLoader } = useLoader();

	const submit = async () => {
		try {
			if (!fullname.trim() && !userDetails?.fullname) {
				return toast.error("Please enter your full name");
			}
			if (!email.trim() && !userDetails?.email) {
				return toast.error("Please enter your email");
			}
			if (!mobile.trim() && !userDetails?.mobile) {
				return toast.error("Please enter your phone number");
			}
			if (!role) {
				return toast.error("Please select your role");
			}

			showLoader('Completing profile...')
			const res = await axios.post(
				`${serverUrl}/auth/complete-profile`,
				{ fullname, email, mobile, role },
				{ withCredentials: true }
			);

			if (res.status === 200) {
				dispatch(setUserDetails(res.data.data));
				toast.success("Profile completed successfully! ");
				navigate("/");
			}
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to complete profile");
		} finally {
			hideLoader()
		}
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh", background: "#f8f9fa" }}
		>

			<div
				className="bg-white p-4 p-md-5"
				style={{
					borderRadius: "16px",
					width: "100%",
					maxWidth: "450px",
					boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
				}}
			>

				{/* 🔙 Back Button */}
				<div className="mb-4">
					<IoArrowBack
						size={22}
						style={{ cursor: "pointer", color: "#666" }}
						onClick={() => navigate(-1)}
					/>
				</div>

				{/* 🔥 Heading */}
				<h3 className="fw-bold mb-2" style={{ color: "#FF4D4F" }}>
					Complete Your Profile 📋
				</h3>

				<p className="text-muted text-sm mb-4">
					Let us know more about you to get started
				</p>
				{/* 🔥 Full Name Input */}
				<div className="mb-3">
					<label className="form-label small fw-semibold">Full Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Enter your full name"
						value={fullname || userDetails?.fullname}
						onChange={(e) => setFullname(e.target.value)}
						style={{
							borderRadius: "10px",
							border: "1px solid #ddd",
							padding: "12px 15px"
						}}
						disabled={userDetails?.fullname ? true : false}
					/>
					<small className="text-muted d-block mt-1">Your full name</small>
				</div>
				{/* 🔥 Email Input */}
				<div className="mb-3">
					<label className="form-label small fw-semibold">Email Address</label>
					<input
						type="email"
						className="form-control"
						placeholder="Enter your email address"
						value={email || userDetails?.email}
						onChange={(e) => setEmail(e.target.value)}
						style={{
							borderRadius: "10px",
							border: "1px solid #ddd",
							padding: "12px 15px"
						}}
						disabled={userDetails?.email ? true : false}
					/>
					<small className="text-muted d-block mt-1">We'll use this for account recovery</small>
				</div>

				<div className="mb-3">
					<label className="form-label small fw-semibold">Phone Number</label>
					<input
						type="tel"
						className="form-control"
						placeholder="Enter your phone number"
						value={mobile || userDetails?.mobile}
						onChange={(e) => setMobile(e.target.value)}
						style={{
							borderRadius: "10px",
							border: "1px solid #ddd",
							padding: "12px 15px"
						}}
						maxLength="10"
						disabled={userDetails?.mobile ? true : false}
					/>
					<small className="text-muted d-block mt-1">10 digit mobile number</small>
				</div>

				{/* 🔥 Role Selection */}
				<div className="mb-4">
					<label className="form-label small fw-semibold">What's Your Role?</label>

					<div className="d-flex flex-column gap-2">

						{/* User */}
						<button
							onClick={() => setRole("user")}
							className="btn btn-outline-danger text-start"
							style={{
								borderRadius: "10px",
								padding: "15px",
								border: role === "user" ? "2px solid #FF4D4F" : "1px solid #ddd",
								backgroundColor: role === "user" ? "rgba(255, 77, 79, 0.08)" : "white",
								color: "#333",
								fontWeight: role === "user" ? "600" : "500"
							}}
						>
							<div className="d-flex align-items-center gap-2">
								<span style={{ fontSize: "20px" }}>🛒</span>
								<div className="text-start">
									<div className="fw-bold">Customer</div>
									<small className="text-muted">Order food from restaurants</small>
								</div>
							</div>
						</button>

						{/* Owner */}
						<button
							onClick={() => setRole("owner")}
							className="btn text-start"
							style={{
								borderRadius: "10px",
								padding: "15px",
								border: role === "owner" ? "2px solid #FF4D4F" : "1px solid #ddd",
								backgroundColor: role === "owner" ? "rgba(255, 77, 79, 0.08)" : "white",
								color: "#333",
								fontWeight: role === "owner" ? "600" : "500"
							}}
						>
							<div className="d-flex align-items-center gap-2">
								<span style={{ fontSize: "20px" }}>🍳</span>
								<div className="text-start">
									<div className="fw-bold">Restaurant Owner</div>
									<small className="text-muted">Manage your restaurant</small>
								</div>
							</div>
						</button>

						{/* Delivery Boy */}
						<button
							onClick={() => setRole("deliveryBoy")}
							className="btn text-start"
							style={{
								borderRadius: "10px",
								padding: "15px",
								border: role === "deliveryBoy" ? "2px solid #FF4D4F" : "1px solid #ddd",
								backgroundColor: role === "deliveryBoy" ? "rgba(255, 77, 79, 0.08)" : "white",
								color: "#333",
								fontWeight: role === "deliveryBoy" ? "600" : "500"
							}}
						>
							<div className="d-flex align-items-center gap-2">
								<span style={{ fontSize: "20px" }}>🚴</span>
								<div className="text-start">
									<div className="fw-bold">Delivery Partner</div>
									<small className="text-muted">Deliver orders and earn</small>
								</div>
							</div>
						</button>

					</div>
				</div>

				{/* 🔥 Submit Button */}
				<button
					onClick={submit}
					className="btn w-100"
					style={{
						backgroundColor: "#FF4D4F",
						color: "#fff",
						borderRadius: "10px",
						padding: "12px",
						fontWeight: "600",
						border: "none"
					}}
				>
					Continue →
				</button>

			</div>
		</div>
	);
}

export default CompleteProfile;