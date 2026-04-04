import React, { useEffect, useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import useCurrentUser from '../customHooks/useCurrentUser';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUserDetails as setDetails } from "../redux/userSlice";
import { toast } from 'react-toastify';
import { useLoader } from '../customHooks/useLoader';

function Signin() {

	const [userDetails, setUserDetails] = useState({
		email: "",
		password: "",
	})
	const dispatch = useDispatch();
	const { showLoader, hideLoader } = useLoader()

	const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserDetails(prev => ({ ...prev, [name]: value }))
	}

	const signin = async (e) => {
		e.preventDefault();
		try {
			if (!userDetails.email.trim()) {
				return toast.error("Please enter your email");
			}
			if (!userDetails.password.trim()) {
				return toast.error("Please enter your password");
			}

			showLoader('Signing in...')
			const res = await axios.post(`${serverUrl}/auth/login`, userDetails, { withCredentials: true })

			if (res.status === 200) {
				dispatch(setDetails(res?.data?.data))
				toast.success("Welcome back! 🎉");
				navigate("/")
			}
		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Invalid email or password";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	}

	const handleGoogleAuth = async () => {
		try {
			showLoader('Signing in with Google...')
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			const res = await axios.post(`${serverUrl}/auth/auth-google`, {
				fullname: result.user.displayName,
				email: result.user.email,
				googleId: result.user.uid
			}, { withCredentials: true });

			if (!res.data.isProfileComplete) {
				navigate("/complete-profile");
			} else {
				dispatch(setDetails(res.data.user));
				toast.success("Welcome back! 🎉");
				navigate("/");
			}

		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Google authentication failed";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{
				minHeight: "100vh",
				background: "#f8f9fa"
			}}
		>

			<div
				className="bg-white p-4 p-md-5"
				style={{
					borderRadius: "16px",
					width: "100%",
					maxWidth: "400px",
					boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
				}}
			>

				{/* 🔥 Heading */}
				<h3 className="fw-bold mb-3 text-center" style={{ color: "#FF4D4F" }}>
					Welcome Back 👋
				</h3>

				<p className="text-muted text-center mb-4 small">
					Login to continue ordering your favorite food
				</p>

				{/* 🔥 Form */}
				<form onSubmit={signin}>

					{/* Email */}
					<div className="mb-3">
						<label className="form-label small">Email</label>
						<input
							type="email"
							name="email"
							value={userDetails.email}
							onChange={handleChange}
							className="form-control"
							placeholder="Enter your email"
							style={{ borderRadius: "10px" }}
						/>
					</div>

					{/* Password */}
					<div className="mb-2">
						<label className="form-label small">Password</label>
						<input
							type="password"
							name="password"
							value={userDetails.password}
							onChange={handleChange}
							className="form-control"
							placeholder="Enter password"
							style={{ borderRadius: "10px" }}
						/>
					</div>

					{/* Reset */}
					<div className="text-end mb-3">
						<span
							className="small text-danger"
							style={{ cursor: "pointer" }}
							onClick={() => navigate("/forgot-password")}
						>
							Forgot Password?
						</span>
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
							fontWeight: "500"
						}}
					>
						Login
					</button>

				</form>

				{/* Divider */}
				<div className="text-center my-3 text-muted small">
					OR
				</div>

				{/* Google Login */}
				<button
					onClick={handleGoogleAuth}
					className="btn w-100 d-flex align-items-center justify-content-center gap-2"
					style={{
						border: "1px solid #ddd",
						borderRadius: "10px",
						padding: "10px"
					}}
				>
					<FcGoogle size={20} />
					Sign in with Google
				</button>

				{/* Signup */}
				<p className="text-center mt-4 small">
					Don’t have an account?{" "}
					<span
						style={{ color: "#FF4D4F", cursor: "pointer", fontWeight: "500" }}
						onClick={() => navigate("/signup")}
					>
						Signup
					</span>
				</p>

			</div>
		</div>
	)
}

export default Signin