import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import { useLoader } from "../customHooks/useLoader";

function CompleteProfile() {
	const [mobile, setMobile] = useState("");
	const [role, setRole] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showLoader, hideLoader } = useLoader();

	const submit = async () => {
		try {
			showLoader('Completing profile...')
			const res = await axios.post(
				`${serverUrl}/auth/complete-profile`,
				{ mobile, role },
				{ withCredentials: true }
			);

			dispatch(setUserDetails(res.data.data));
			navigate("/");
		} catch (err) {
			console.log(err.message);
		} finally {
			hideLoader()
		}
	};

	return (
		<div className="container mt-5">
			<h3>Complete Profile</h3>

			<input
				type="number"
				placeholder="Phone"
				onChange={(e) => setMobile(Number(e.target.value))}
			/>

			<div>
				{["user", "owner", "deliveryBoy"].map(r => (
					<button key={r} onClick={() => setRole(r)}>
						{r}
					</button>
				))}
			</div>

			<button onClick={submit}>Submit</button>
		</div>
	);
}

export default CompleteProfile;