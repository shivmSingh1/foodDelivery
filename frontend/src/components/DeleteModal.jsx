import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { serverUrl } from '../App';
import { setShopDetails } from '../redux/shopSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

function DeleteModal(props) {
	console.log(props)
	const dispatch = useDispatch()
	const handleDelete = async () => {
		try {
			const res = await axios.delete(`${serverUrl}/item/delete-item/${props.id}`, { withCredentials: true })
			if (res?.status === 200) {
				dispatch(setShopDetails(res?.data?.data))
				toast.success(res?.data?.message)
				props.onHide()
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}
	return (
		<Modal
			{...props}
			size="sm"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
			</Modal.Header>
			<Modal.Body>
				<strong>Are you sure?</strong>
				<p>you want to delete this item ?</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleDelete}>Yes</Button>
				<Button onClick={props.onHide}>No</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default DeleteModal;

