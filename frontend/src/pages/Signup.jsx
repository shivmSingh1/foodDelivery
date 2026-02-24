import React from 'react'
import axios from "axios"
import { useState } from 'react';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Signup() {
	const navigate = useNavigate()
	const [userDetails, setUserDetails] = useState({
		fullname: "",
		email: "",
		password: "",
		phone: "",
		role: ""
	})

	const handleChange = (e) => {

		const name = e.target.name;
		const value = e.target.value;

		setUserDetails((prev) => ({
			...prev, [name]: value
		}
		))
	}

	const signup = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${serverUrl}/auth/signup`, { ...userDetails }, { withCredentials: true })
			if (res.status === 200) {
				navigate("/")
			}
		} catch (error) {
			console.log("signup error", error.message)
		}
	}

	const signupWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			// console.log("result", result)
			// console.log(result.user.displayName, result.user.email)
			try {
				if (!userDetails.phone || !userDetails.role) {
					return toast.error("missing phone no or role")
				}
				const details = {
					phone: userDetails?.phone,
					role: userDetails?.role,
					fullname: result?.user?.displayName,
					email: result?.user?.email
				}
				const res = await axios.post(`${serverUrl}/auth/auth-google`, details, { withCredentials: true })
				if (res.status === 200) {
					navigate("/")
				}
			} catch (error) {
				toast.error(error.response?.data?.message)
				console.log("auth with google error", error.response?.data?.message)
			}

		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div className='container' >
			<form onSubmit={signup} className='d-flex flex-column' >
				<div className='mb-2' >
					<label htmlFor='fullname' >fullname</label>
					<input className='me-4' type="text" name="fullname" value={userDetails.fullname} onChange={(e) => handleChange(e)} />
				</div>

				<div className='mb-2'>
					<label htmlFor="email">Email</label>
					<input className='me-4' type="email" name="email" value={userDetails.email} onChange={(e) => handleChange(e)} />
				</div>


				<div className='mb-2'>
					<label htmlFor="phone">Phone</label>
					<input className='me-4' type="phone" name="phone" value={userDetails.phone} onChange={(e) => handleChange(e)} />
				</div>

				<div className='mb-2'>
					<label className='me-4' htmlFor="role">Role:</label>

					<input className='m-2' type="radio" name="role" value="user" onChange={(e) => handleChange(e)} />User

					<input className='m-2' type="radio" name="role" value="owner" onChange={(e) => handleChange(e)} />Owner

					<input className='m-2' type="radio" name="role" value="deliveryBoy" onChange={(e) => handleChange(e)} />delivery Boy
				</div>

				<div className='mb-2'>
					<label htmlFor="password">Password</label>
					<input className='me-4' type="password" name="password" value={userDetails.password} onChange={(e) => handleChange(e)} />
				</div>

				<input className='mb-2' type="button" onClick={signupWithGoogle} value="signup with google" />

				<input type="submit" value="submit" />
			</form>
			<div className='m-2' >
				<p>already have an account? <strong onClick={() => navigate("/")} >Signin</strong></p>
			</div>
		</div>
	)
}

export default Signup