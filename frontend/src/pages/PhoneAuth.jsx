import React, { useState, useRef } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoader } from "../customHooks/useLoader";
import { setUserDetails } from "../redux/userSlice";
import { useDispatch } from "react-redux";

function PhoneAuth() {
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [confirmObj, setConfirmObj] = useState(null);
	const [otpSent, setOtpSent] = useState(false);
	const navigate = useNavigate();
	const recaptchaRef = useRef(null);
	const dispatch = useDispatch()
	const { showLoader, hideLoader } = useLoader();

	const setupRecaptcha = () => {
		if (!recaptchaRef.current) {
			recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
				size: "invisible",
			});
		}
		return recaptchaRef.current;
	};

	const sendOtp = async () => {
		if (phone.length !== 10) {
			return toast.error("Enter valid 10-digit phone number");
		}

		try {
			showLoader("Sending OTP...");
			const appVerifier = setupRecaptcha();
			const confirmation = await signInWithPhoneNumber(
				auth,
				"+91" + phone,
				appVerifier
			);

			setConfirmObj(confirmation);
			setOtpSent(true);
			toast.success(" OTP sent successfully!");
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Failed to send OTP");
		} finally {
			hideLoader();
		}
	};

	const verifyOtp = async () => {
		if (otp.length !== 6) {
			return toast.error("Enter valid 6-digit OTP");
		}

		try {
			showLoader("Verifying OTP...");
			const result = await confirmObj.confirm(otp);
			const idToken = await result.user.getIdToken();

			const res = await axios.post(
				`${serverUrl}/auth/auth-phone`,
				{ token: idToken },
				{ withCredentials: true }
			);

			toast.success("Login successful!");

			if (!res.data.isProfileComplete) {
				navigate("/complete-profile");
			} else {
				dispatch(setUserDetails(res.data.user));
				navigate("/");
			}
		} catch (error) {
			console.error(error);
			toast.error("Invalid or expired OTP");
		} finally {
			hideLoader();
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
					Phone Login 📱
				</h3>

				<p className="text-muted text-center small mb-4">
					Quick and secure login with your phone number
				</p>

				{!otpSent ? (
					<>
						{/* Phone Input */}
						<div className="mb-3">
							<label className="form-label small">Phone Number</label>
							<div className="input-group">
								<span className="input-group-text" style={{ background: "#f8f9fa" }}>
									+91
								</span>
								<input
									type="tel"
									placeholder="9999999999"
									className="form-control"
									value={phone}
									onChange={(e) =>
										setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
									}
									style={{ borderRadius: "0 10px 10px 0" }}
									maxLength="10"
								/>
							</div>
							<small className="text-muted d-block mt-2">Enter 10 digits without country code</small>
						</div>

						{/* Send OTP Button */}
						<button
							className="btn w-100 mb-3"
							onClick={sendOtp}
							style={{
								backgroundColor: "#FF4D4F",
								color: "#fff",
								borderRadius: "10px",
								padding: "10px",
								fontWeight: "500",
								border: "none"
							}}
						>
							Send OTP
						</button>
					</>
				) : (
					<>
						{/* Edit Phone */}
						<div className="mb-3 p-3" style={{ background: "#f8f9fa", borderRadius: "10px" }}>
							<p className="small mb-0 text-muted">
								Verify OTP sent to <strong>+91{phone}</strong>
							</p>
							<button
								type="button"
								className="btn btn-link btn-sm p-0 mt-2"
								onClick={() => { setOtpSent(false); setOtp(""); }}
								style={{ color: "#FF4D4F" }}
							>
								Edit Phone Number
							</button>
						</div>

						{/* OTP Input */}
						<div className="mb-3">
							<label className="form-label small">OTP</label>
							<input
								type="tel"
								placeholder="000000"
								className="form-control text-center"
								value={otp}
								onChange={(e) =>
									setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
								}
								style={{
									borderRadius: "10px",
									fontSize: "1.5rem",
									letterSpacing: "8px",
									fontWeight: "bold"
								}}
								maxLength="6"
							/>
							<small className="text-muted d-block mt-2">Enter 6-digit OTP</small>
						</div>

						{/* Verify OTP Button */}
						<button
							className="btn w-100 mb-3"
							onClick={verifyOtp}
							style={{
								backgroundColor: "#FF4D4F",
								color: "#fff",
								borderRadius: "10px",
								padding: "10px",
								fontWeight: "500",
								border: "none"
							}}
						>
							Verify & Login
						</button>
					</>
				)}

				{/* Divider */}
				<div className="text-center my-3 text-muted small">OR</div>

				{/* Signup Link */}
				<div className="d-flex justify-content-center flex-wrap gap-1 small text-center">
					<span>Don't have an account?</span>
					<span
						style={{ color: "#FF4D4F", cursor: "pointer", fontWeight: "500" }}
						onClick={() => navigate("/signup")}
					>
						Signup
					</span>
					<span className="text-muted">|</span>
					<span
						style={{ color: "#FF4D4F", cursor: "pointer", fontWeight: "500" }}
						onClick={() => navigate("/")}
					>
						Signin with Email
					</span>
				</div>

				<div id="recaptcha-container"></div>
			</div>
		</div>
	);
}

export default PhoneAuth;