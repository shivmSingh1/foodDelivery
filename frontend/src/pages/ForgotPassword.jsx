import React from 'react'
import { useState } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'

function ForgotPassword() {
	const [step, setSteps] = useState(1)
	const [userDetails, setUserDetails] = useState({
		email: "",
		otp: "",
		password: '',
		confirmPassword: ""
	})

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserDetails((prev) => (
			{ ...prev, [name]: value }
		))
	}

	const handleSendOtp = async () => {
		try {
			const res = await axios.post(`${serverUrl}/auth/send-otp`, { email: userDetails.email }, { withCredentials: true })
			if (res.status === 200) {
				setSteps(2);
				alert(res?.data?.data?.message)
			}
		} catch (error) {
			console.log("send opt frontend error", error.message)
		}
	}

	const handleVerifyOtp = async () => {
		try {
			const res = await axios.post(`${serverUrl}/auth/verify-otp`, { email: userDetails.email, otp: userDetails.otp }, { withCredentials: true })
			if (res.status === 200) {
				setSteps(3);
				alert(res?.data?.data?.message)
			}
		} catch (error) {
			console.log("send opt frontend error", error.message)
		}
	}

	const handleResetPassword = async () => {
		try {
			if (userDetails.password !== userDetails.password) {
				return alert("password not matched with confirm password")
			}
			const res = await axios.put(`${serverUrl}/auth/reset-password`, { email: userDetails.email, password: userDetails.password }, { withCredentials: true })
			if (res.status === 200) {
				alert("password reset success")
			}
		} catch (error) {
			console.log("send opt frontend error", error.message)
		}
	}

	return (
		<div className='border shadow p-4' >
			{
				step === 1 && (
					<div className='d-flex flex-column gap-4' >
						<h6>Forgot Password</h6>
						<label htmlFor="email">Email</label>
						<input type="email" name="email" value={userDetails.email} onChange={handleChange} />
						<button className='btn btn-primary' onClick={handleSendOtp} >Send Otp</button>
					</div>
				)
			}
			{
				step === 2 && (
					<div className='d-flex flex-column gap-4' >
						<h6>verify otp</h6>
						<label htmlFor="otp">Enter Otp</label>
						<input type="number" name="otp" value={userDetails.otp} onChange={handleChange} />
						<button className='btn btn-primary' onClick={handleVerifyOtp} >Verify Otp</button>
					</div>
				)
			}
			{
				step === 3 && (
					<div className='d-flex flex-column gap-4' >
						<h6>Enter you new password</h6>
						<label htmlFor="password">password</label>
						<input type="text" name="password" value={userDetails.password} onChange={handleChange} />
						<label htmlFor="confirmPassword">confirm password</label>
						<input type="text" name="confirmPassword" value={userDetails.confirmPassword} onChange={handleChange} />
						<button className='btn btn-success' onClick={handleResetPassword} >Reset Password</button>
					</div>
				)
			}
		</div>
	)
}

export default ForgotPassword