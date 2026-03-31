import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { serverUrl } from '../App';
import { setShopDetails } from '../redux/shopSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaTrash } from "react-icons/fa";

function DeleteModal(props) {

	const dispatch = useDispatch()

	const handleDelete = async () => {
		try {
			const res = await axios.delete(
				`${serverUrl}/item/delete-item/${props.id}`,
				{ withCredentials: true }
			)

			if (res?.status === 200) {
				dispatch(setShopDetails(res?.data?.data))
				toast.success(res?.data?.message)
				props.onHide()
			}
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<Modal
			{...props}
			centered
			contentClassName="border-0"
		>

			{/* 🔥 Body */}
			<div
				className="p-4 text-center"
				style={{
					borderRadius: "16px",
					boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
				}}
			>

				{/* 🔥 Icon */}
				<div
					className="mx-auto mb-3 d-flex align-items-center justify-content-center"
					style={{
						width: "60px",
						height: "60px",
						borderRadius: "50%",
						background: "#ffe5e5"
					}}
				>
					<FaTrash size={22} color="#FF4D4F" />
				</div>

				{/* 🔥 Text */}
				<h6 className="fw-bold mb-1">Delete Item?</h6>
				<p className="text-muted small mb-3">
					This action cannot be undone.
				</p>

				{/* 🔥 Buttons */}
				<div className="d-flex gap-2">

					<Button
						className="w-50"
						style={{
							background: "#FF4D4F",
							border: "none",
							borderRadius: "10px"
						}}
						onClick={handleDelete}
					>
						Delete
					</Button>

					<Button
						variant="light"
						className="w-50"
						style={{ borderRadius: "10px" }}
						onClick={props.onHide}
					>
						Cancel
					</Button>

				</div>

			</div>

		</Modal>
	)
}

export default DeleteModal