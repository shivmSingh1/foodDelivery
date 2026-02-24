import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setShopDetails } from '../redux/shopSlice'
import UseGetShops from '../customHooks/UseGetShops'
import DeleteModal from './DeleteModal'

function ItemCard({ item }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [modalShow, setModalShow] = React.useState(false);

	const handleEdit = async () => {
		try {
			const res = await axios.delete(`${serverUrl}/item/delete-tem`, { withCredentials: true })
			if (res?.status === 200) {
				toast.success(res?.data?.message)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(error?.response?.data?.message)
		}
	}
	return (
		<div className='broder shadow p-4 d-flex mb-2' style={{ width: "500px" }} >
			<img src={item?.image} alt={item?.name} width={100} />
			<div className='d-flex flex-column gap-1 ms-3' style={{ width: "100%" }} >
				<strong>{item?.name}</strong>
				<p>{item?.price}</p>
				<p>{item?.category}, &nbsp;{item?.foodType}</p>
				<div className='d-flex ms-auto gap-3' >
					<span onClick={() => navigate(`/add-item/${item?._id}`)} >edit</span>
					<span onClick={() => setModalShow(true)} >delete</span>
				</div>
			</div>
			<DeleteModal
				id={item?._id}
				show={modalShow}
				onHide={() => setModalShow(false)}
			/>
		</div>
	)
}

export default ItemCard