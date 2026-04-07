import React, { useState } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import { useLoader } from '../customHooks/useLoader';

function ForgotPassword() {

	const [step, setSteps] = useState(1)

	const [userDetails, setUserDetails] = useState({
		email: "",
		otp: "",
		password: '',
		confirmPassword: ""
	})

	const navigate = useNavigate()
	const { showLoader, hideLoader } = useLoader()

	const handleChange = (e) => {
		const { name, value } = e.target
		setUserDetails(prev => ({ ...prev, [name]: value }))
	}


	const handleSendOtp = async () => {
		try {
			if (!userDetails.email.trim()) {
				return toast.error("Please enter your email");
			}
			showLoader('Sending OTP...')
			const res = await axios.post(
				`${serverUrl}/auth/send-otp`,
				{ email: userDetails.email },
				{ withCredentials: true }
			)

			if (res.status === 200) {
				setSteps(2)
				toast.success("OTP sent to your email! Check your inbox.")
			}

		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Failed to send OTP";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	}


	const handleVerifyOtp = async () => {
		try {
			if (!userDetails.otp.trim()) {
				return toast.error("Please enter the OTP");
			}
			showLoader('Verifying OTP...')
			const res = await axios.post(
				`${serverUrl}/auth/verify-otp`,
				{ email: userDetails.email, otp: userDetails.otp },
				{ withCredentials: true }
			)

			if (res.status === 200) {
				setSteps(3)
				toast.success("OTP verified successfully! ")
			}

		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Invalid OTP";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	}

	// 🔥 Reset Password
	const handleResetPassword = async () => {
		try {
			if (!userDetails.password.trim()) {
				return toast.error("Please enter a new password");
			}
			if (!userDetails.confirmPassword.trim()) {
				return toast.error("Please confirm your password");
			}
			if (userDetails.password.length < 6) {
				return toast.error("Password must be at least 6 characters");
			}
			if (userDetails.password !== userDetails.confirmPassword) {
				return toast.error("Passwords do not match");
			}

			showLoader('Resetting password...')

			const res = await axios.put(
				`${serverUrl}/auth/reset-password`,
				{
					email: userDetails.email,
					password: userDetails.password
				},
				{ withCredentials: true }
			)

			if (res.status === 200) {
				toast.success("Password reset successful! ");
				navigate("/signin");
			}

		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Failed to reset password";
			toast.error(errorMsg);
		} finally {
			hideLoader()
		}
	}

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3 d-flex justify-content-center">

				<div style={{ width: "100%", maxWidth: "400px" }}>

					{/* 🔙 Header */}
					<div className="d-flex align-items-center gap-3 mb-3">
						<IoArrowBack
							size={22}
							style={{ cursor: "pointer" }}
							onClick={() => navigate(-1)}
						/>
						<h5 className="fw-bold m-0">Reset Password</h5>
					</div>

					{/* 🔥 Card */}
					<div
						className="bg-white p-4"
						style={{
							borderRadius: "14px",
							boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
						}}
					>

						{/* 🔥 Step Indicator */}
						<div className="d-flex justify-content-between mb-4 small">
							<span className={step >= 1 ? "text-danger fw-bold" : "text-muted"}>Email</span>
							<span className={step >= 2 ? "text-danger fw-bold" : "text-muted"}>OTP</span>
							<span className={step >= 3 ? "text-danger fw-bold" : "text-muted"}>Reset</span>
						</div>

						{/* STEP 1 */}
						{step === 1 && (
							<div className="d-flex flex-column gap-3">

								<input
									type="email"
									name="email"
									placeholder="Enter your email"
									className="form-control"
									value={userDetails.email}
									onChange={handleChange}
								/>

								<button
									className="btn w-100"
									style={{
										background: "#FF4D4F",
										color: "#fff",
										borderRadius: "10px"
									}}
									onClick={handleSendOtp}
								>
									Send OTP
								</button>

							</div>
						)}

						{/* STEP 2 */}
						{step === 2 && (
							<div className="d-flex flex-column gap-3">

								<input
									type="number"
									name="otp"
									placeholder="Enter OTP"
									className="form-control"
									value={userDetails.otp}
									onChange={handleChange}
								/>

								<button
									className="btn w-100"
									style={{
										background: "#FF4D4F",
										color: "#fff",
										borderRadius: "10px"
									}}
									onClick={handleVerifyOtp}
								>
									Verify OTP
								</button>

							</div>
						)}

						{/* STEP 3 */}
						{step === 3 && (
							<div className="d-flex flex-column gap-3">

								<input
									type="password"
									name="password"
									placeholder="New Password"
									className="form-control"
									value={userDetails.password}
									onChange={handleChange}
								/>

								<input
									type="password"
									name="confirmPassword"
									placeholder="Confirm Password"
									className="form-control"
									value={userDetails.confirmPassword}
									onChange={handleChange}
								/>

								<button
									className="btn w-100"
									style={{
										background: "#FF4D4F",
										color: "#fff",
										borderRadius: "10px"
									}}
									onClick={handleResetPassword}
								>
									Reset Password
								</button>

							</div>
						)}

					</div>

				</div>

			</div>
		</div>
	)
}

export default ForgotPassword