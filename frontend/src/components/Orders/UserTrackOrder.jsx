import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../../App'
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom marker icons
const userMarkerIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
})

const deliveryBoyMarkerIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
})

function UserTrackOrder() {
	const { orderId } = useParams()
	const [order, setOrder] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetchOrderDetails()
	}, [orderId])

	const fetchOrderDetails = async () => {
		try {
			setLoading(true)
			const res = await axios.get(`${serverUrl}/order/getOrderByid/${orderId}`, { withCredentials: true })
			if (res.status === 200) {
				setOrder(res?.data?.data)
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error?.response?.data?.message || "Failed to fetch order")
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return <div className='container mt-5'><h5>Loading order details...</h5></div>
	}

	if (!order) {
		return <div className='container mt-5'><h5>Order not found</h5></div>
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending': return 'warning'
			case 'confirmed': return 'info'
			case 'out for delivery': return 'primary'
			case 'delivered': return 'success'
			default: return 'secondary'
		}
	}

	// Get user delivery location
	const userLocation = [
		order?.deliveryAddress?.lattitude || 0,
		order?.deliveryAddress?.longitude || 0
	]

	// Get delivery boy current location
	const deliveryBoyLocation = order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates
		? [
			order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates[1],
			order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates[0]
		]
		: null

	// Calculate center point between both locations
	const mapCenter = deliveryBoyLocation
		? [(userLocation[0] + deliveryBoyLocation[0]) / 2, (userLocation[1] + deliveryBoyLocation[1]) / 2]
		: userLocation

	return (
		<div className='container mt-5'>
			<div className='row'>
				{/* Order Status Section */}
				<div className='col-md-8'>
					<div className='card shadow-sm mb-4'>
						<div className='card-header bg-primary text-white'>
							<h5 className='mb-0'>Order Tracking</h5>
						</div>
						<div className='card-body'>
							<div className='row mb-4'>
								<div className='col-md-6'>
									<p><strong>Order ID:</strong> {order?._id}</p>
									<p><strong>Status:</strong> <span className={`badge bg-${getStatusColor(order?.status)}`}>{order?.status?.toUpperCase()}</span></p>
									<p><strong>Total Amount:</strong> ₹{order?.totalAmount}</p>
								</div>
								<div className='col-md-6'>
									<p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
									<p><strong>Order Date:</strong> {new Date(order?.createdAt).toLocaleDateString()}</p>
								</div>
							</div>

							{/* Delivery Address */}
							<div className='mb-4'>
								<h6 className='mb-2'>📍 Delivery Address:</h6>
								<p className='text-muted'>{order?.deliveryAddress?.text}</p>
								<p className='small text-muted'>
									Lat: {order?.deliveryAddress?.lattitude}, Lon: {order?.deliveryAddress?.longitude}
								</p>
							</div>

							{/* Delivery Boy Info */}
							{order?.shopOrder?.[0]?.assignedDeliveryBoy && (
								<div className='mb-4 p-3 bg-light rounded'>
									<h6 className='mb-2'>🚴 Delivery Boy Information</h6>
									<p className='mb-1'><strong>Name:</strong> {order?.shopOrder?.[0]?.assignedDeliveryBoy?.fullname}</p>
									<p className='mb-1'><strong>Phone:</strong> {order?.shopOrder?.[0]?.assignedDeliveryBoy?.mobile}</p>
									<p className='mb-0'><strong>Current Location:</strong></p>
									<p className='text-muted small'>
										Lat: {order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates[1]},
										Lon: {order?.shopOrder?.[0]?.assignedDeliveryBoy?.location?.coordinates[0]}
									</p>
								</div>
							)}

							{/* Live Tracking Map */}
							<div className='mb-4'>
								<h6 className='mb-2'>🗺️ Live Tracking Map:</h6>
								<div style={{ height: '450px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #007bff' }}>
									{userLocation[0] && userLocation[1] ? (
										<MapContainer
											center={mapCenter}
											zoom={15}
											style={{ height: "100%", width: "100%" }}
										>
											<TileLayer
												attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
												url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											/>

											{/* User Marker */}
											<Marker position={userLocation} icon={userMarkerIcon}>
												<Popup>
													<div>
														<strong>Delivery Address</strong>
														<p>{order?.user?.fullname}</p>
														<p className='small'>{order?.deliveryAddress?.text}</p>
													</div>
												</Popup>
											</Marker>

											{/* Delivery Boy Marker */}
											{deliveryBoyLocation && (
												<>
													<Marker position={deliveryBoyLocation} icon={deliveryBoyMarkerIcon}>
														<Popup>
															<div>
																<strong>Delivery Boy</strong>
																<p>{order?.shopOrder?.[0]?.assignedDeliveryBoy?.fullname}</p>
																<p className='small'>📞 {order?.shopOrder?.[0]?.assignedDeliveryBoy?.mobile}</p>
															</div>
														</Popup>
													</Marker>

													{/* Line between delivery boy and user */}
													<Polyline
														positions={[deliveryBoyLocation, userLocation]}
														color="blue"
														weight={3}
														opacity={0.7}
														dashArray="5, 5"
													/>
												</>
											)}
										</MapContainer>
									) : (
										<div className='d-flex align-items-center justify-content-center' style={{ height: '100%', backgroundColor: '#f0f0f0' }}>
											<p className='text-muted'>Location not available</p>
										</div>
									)}
								</div>
								<small className='text-muted d-block mt-2'>
									<span style={{ color: 'red' }}>●</span> Red marker = Your delivery address |
									<span style={{ color: 'blue' }}> ●</span> Blue marker = Delivery boy location
								</small>
							</div>

							{/* Shop Orders */}
							<div>
								<h6 className='mb-3'>Order Items:</h6>
								{order?.shopOrder?.map((shop, idx) => (
									<div key={idx} className='mb-4 p-3 border rounded'>
										<h6 className='text-primary'>{shop?.shop?.name}</h6>
										<div className='table-responsive'>
											<table className='table table-sm mb-0'>
												<thead>
													<tr>
														<th>Item</th>
														<th>Price</th>
														<th>Qty</th>
														<th>Total</th>
													</tr>
												</thead>
												<tbody>
													{shop?.shopOrderItems?.map((item, itemIdx) => (
														<tr key={itemIdx}>
															<td>{item?.name}</td>
															<td>₹{item?.price}</td>
															<td>{item?.quantity}</td>
															<td>₹{item?.price * item?.quantity}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										<div className='mt-2 text-end'>
											<p className='mb-0'><strong>Subtotal:</strong> ₹{shop?.subTotal}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Order Summary Sidebar */}
				<div className='col-md-4'>
					<div className='card shadow-sm sticky-top' style={{ top: '20px' }}>
						<div className='card-header bg-dark text-white'>
							<h6 className='mb-0'>Order Summary</h6>
						</div>
						<div className='card-body'>
							<div className='mb-3'>
								<p className='mb-1'><strong>Subtotal:</strong></p>
								<p className='text-muted'>₹{order?.shopOrder?.reduce((sum, so) => sum + so.subTotal, 0)}</p>
							</div>
							<div className='mb-3'>
								<p className='mb-1'><strong>Delivery Fee:</strong></p>
								<p className='text-muted'>₹0</p>
							</div>
							<hr />
							<div className='mb-4'>
								<p className='mb-1'><strong>Total Amount:</strong></p>
								<h5>₹{order?.totalAmount}</h5>
							</div>

							{/* Status Timeline */}
							<div>
								<h6 className='mb-3'>Status Timeline:</h6>
								<div className='timeline'>
									<div className='timeline-item mb-3'>
										<div className='d-flex'>
											<div className='timeline-marker bg-success text-white'>✓</div>
											<div className='ms-3'>
												<p className='mb-0'><strong>Order Placed</strong></p>
												<small className='text-muted'>{new Date(order?.createdAt).toLocaleString()}</small>
											</div>
										</div>
									</div>
									<div className={`timeline-item mb-3 ${order?.status !== 'pending' ? 'completed' : ''}`}>
										<div className='d-flex'>
											<div className={`timeline-marker ${order?.status !== 'pending' ? 'bg-success text-white' : 'bg-light'}`}>
												{order?.status !== 'pending' ? '✓' : '○'}
											</div>
											<div className='ms-3'>
												<p className='mb-0'><strong>Confirmed by Shop</strong></p>
												<small className='text-muted'>Waiting...</small>
											</div>
										</div>
									</div>
									<div className={`timeline-item mb-3 ${['out for delivery', 'delivered'].includes(order?.status) ? 'completed' : ''}`}>
										<div className='d-flex'>
											<div className={`timeline-marker ${['out for delivery', 'delivered'].includes(order?.status) ? 'bg-success text-white' : 'bg-light'}`}>
												{['out for delivery', 'delivered'].includes(order?.status) ? '✓' : '○'}
											</div>
											<div className='ms-3'>
												<p className='mb-0'><strong>Out for Delivery</strong></p>
												<small className='text-muted'>In progress...</small>
											</div>
										</div>
									</div>
									<div className={`timeline-item ${order?.status === 'delivered' ? 'completed' : ''}`}>
										<div className='d-flex'>
											<div className={`timeline-marker ${order?.status === 'delivered' ? 'bg-success text-white' : 'bg-light'}`}>
												{order?.status === 'delivered' ? '✓' : '○'}
											</div>
											<div className='ms-3'>
												<p className='mb-0'><strong>Delivered</strong></p>
												<small className='text-muted'>Pending...</small>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.timeline-marker {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					font-weight: bold;
				}
				.timeline-item.completed .timeline-marker {
					background-color: #28a745 !important;
					color: white;
				}
			`}</style>
		</div>
	)
}

export default UserTrackOrder