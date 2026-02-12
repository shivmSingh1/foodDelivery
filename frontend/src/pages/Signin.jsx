import React from 'react'
import axios from "axios"
import { useState } from 'react';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';

function Signin() {
	const [userDetails, setUserDetails] = useState({
		email: "",
		password: "",
	})

	const navigate = useNavigate()

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserDetails((prev) => ({
			...prev, [name]: value
		}
		))
	}

	const signin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${serverUrl}/auth/login`, { ...userDetails }, { withCredentials: true })
			if (res.status === 200) {
				alert("success")
				navigate("/")
			}
		} catch (error) {
			console.log("signup error", error.message)
		}
	}

	const signinWithGoogle = async () => {
		try {
			console.log("here")
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			try {
				const details = {
					email: result?.user?.email
				}
				const res = await axios.post(`${serverUrl}/auth/auth-google`, details, { withCredentials: true })
				if (res.status === 200) {
					navigate("/")
				}
			} catch (error) {
				console.log("auth with google error", error.message)
			}

		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div>
			<form onSubmit={signin} className='d-flex flex-column' >

				<div className='mb-2'>
					<label htmlFor="email">Email</label>
					<input className='me-4' type="email" name="email" value={userDetails.email} onChange={(e) => handleChange(e)} />
				</div>

				<div className='mb-2'>
					<label htmlFor="password">Password</label>
					<input className='me-4' type="password" name="password" value={userDetails.password} onChange={(e) => handleChange(e)} />
				</div>

				<h5 style={{ cursor: "pointer" }} onClick={() => navigate("/forgot-password")} >Reset Password</h5>

				<input className='mb-2' onClick={signinWithGoogle} type="button" value="signin with google" />

				<input type="submit" value="submit" />
			</form>
		</div>
	)
}

export default Signin