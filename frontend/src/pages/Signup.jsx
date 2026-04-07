import React, { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUserDetails as setDetails } from "../redux/userSlice";
import { useLoader } from '../customHooks/useLoader';

function Signup() {

	const navigate = useNavigate()
	const dispatch = useDispatch();
	const { showLoader, hideLoader } = useLoader()
	const [userDetails, setUserDetails] = useState({
		fullname: "",
		email: "",
		password: "",
		phone: "",
		role: ""
	})

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserDetails(prev => ({ ...prev, [name]: value }))
	}

	const signup = async (e) => {
		e.preventDefault();
		try {
			if (!userDetails.fullname.trim()) {
				return toast.error("Please enter your full name");
			}
			if (!userDetails.email.trim()) {
				return toast.error("Please enter your email");
			}
			if (!userDetails.phone.trim()) {
				return toast.error("Please enter your phone number");
			}
			if (userDetails.phone.length < 10) {
				return toast.error("Phone number must be at least 10 digits");
			}
			if (!userDetails.role) {
				return toast.error("Please select your role");
			}
			if (!userDetails.password.trim()) {
				return toast.error("Please enter a password");
			}
			if (userDetails.password.length < 6) {
				return toast.error("Password must be at least 6 characters");
			}

			showLoader('Creating account...')
			const res = await axios.post(`${serverUrl}/auth/signup`, userDetails, { withCredentials: true })
			dispatch(setDetails(res?.data?.data))
			if (res.status === 200) {
				toast.success("Account created successfully! ");
				navigate("/")
			}
		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Signup failed";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	}

	const handleGoogleAuth = async () => {
		try {
			showLoader('Signing up with Google...')
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken();

			const res = await axios.post(`${serverUrl}/auth/auth-google`, {
				token: idToken
			}, { withCredentials: true });

			if (!res.data.isProfileComplete) {
				navigate("/complete-profile");
			} else {
				dispatch(setDetails(res.data.user));
				toast.success("Account created successfully! ");
				navigate("/");
			}

		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Google signup failed";
			toast.error(errorMsg);
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
					maxWidth: "420px",
					boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
				}}
			>

				{/* 🔥 Heading */}
				<h3 className="fw-bold text-center mb-2" style={{ color: "#FF4D4F" }}>
					Create Account
				</h3>

				<p className="text-muted text-center small mb-4">
					Join us and start ordering your favorite food
				</p>

				<form onSubmit={signup}>

					{/* Fullname */}
					<div className="mb-3">
						<label className="form-label small fw-500">Full Name</label>
						<input
							type="text"
							name="fullname"
							value={userDetails.fullname}
							onChange={handleChange}
							className="form-control"
							placeholder="John Doe"
							style={{ borderRadius: "10px", padding: "10px 12px" }}
						/>
					</div>

					{/* Email */}
					<div className="mb-3">
						<label className="form-label small fw-500">Email Address</label>
						<input
							type="email"
							name="email"
							value={userDetails.email}
							onChange={handleChange}
							className="form-control"
							placeholder="your@email.com"
							style={{ borderRadius: "10px", padding: "10px 12px" }}
						/>
					</div>

					{/* Phone */}
					<div className="mb-3">
						<label className="form-label small fw-500">Phone Number</label>
						<input
							type="tel"
							name="phone"
							value={userDetails.phone}
							onChange={handleChange}
							className="form-control"
							placeholder="9999999999"
							style={{ borderRadius: "10px", padding: "10px 12px" }}
						/>
					</div>

					{/* Role */}
					<div className="mb-3">
						<label className="form-label small">Select Role</label>

						<div className="d-flex gap-2 flex-wrap">

							{["user", "owner", "deliveryBoy"].map(role => (
								<span
									key={role}
									onClick={() => setUserDetails(prev => ({ ...prev, role }))}
									className={`px-3 py-2 rounded-pill small border ${userDetails.role === role ? "text-white" : ""}`}
									style={{
										cursor: "pointer",
										backgroundColor: userDetails.role === role ? "#FF4D4F" : "#fff",
										borderColor: "#FF4D4F"
									}}
								>
									{role}
								</span>
							))}

						</div>
					</div>

					{/* Password */}
					<div className="mb-3">
						<label className="form-label small fw-500">Password</label>
						<input
							type="password"
							name="password"
							value={userDetails.password}
							onChange={handleChange}
							className="form-control"
							placeholder="••••••••"
							style={{ borderRadius: "10px", padding: "10px 12px" }}
						/>
					</div>

					{/* Submit */}
					<button
						type="submit"
						className="btn w-100 mb-3"
						style={{
							backgroundColor: "#FF4D4F",
							color: "#fff",
							borderRadius: "10px",
							padding: "10px",
							fontWeight: "500",
							border: "none"
						}}
					>
						Create Account
					</button>

				</form>

				{/* Divider */}
				<div className="text-center my-3 text-muted small">OR</div>

				{/* Google Signup */}
				<button
					onClick={handleGoogleAuth}
					className="btn w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
					style={{
						border: "1px solid #ddd",
						borderRadius: "10px",
						padding: "10px",
						color: "#333",
						backgroundColor: "#fff"
					}}
				>
					<FcGoogle size={20} />
					<span>Signup with Google</span>
				</button>

				{/* Signin Links */}
				<div className="d-flex justify-content-center flex-wrap gap-1 small text-center">
					<span>Already have an account?</span>
					<span
						style={{ color: "#FF4D4F", cursor: "pointer", fontWeight: "500" }}
						onClick={() => navigate("/")}
					>
						Signin
					</span>
					<span className="text-muted">|</span>
					<span
						style={{ color: "#FF4D4F", cursor: "pointer", fontWeight: "500" }}
						onClick={() => navigate("/auth-phone")}
					>
						Login with Phone
					</span>
				</div>

			</div>
		</div>
	)
}

export default Signup