import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartCards from './CartCards';
import { LiaRupeeSignSolid } from 'react-icons/lia';

function Cart() {

	const { cart } = useSelector(state => state.user)
	const navigate = useNavigate()

	// 🔥 Total
	const totalAmount = cart?.reduce((acc, item) => acc + (item.price * item.quantity), 0)

	return (
		<div style={{ background: "#f8f9fa", minHeight: "100vh" }}>

			<div className="container py-3">

				{/* 🔥 Header */}
				<div className="d-flex align-items-center gap-3 mb-3">
					<IoArrowBack
						size={22}
						style={{ cursor: "pointer" }}
						onClick={() => navigate(-1)}
					/>
					<h5 className="m-0 fw-bold">Your Cart</h5>
				</div>

				{/* 🔥 Empty Cart */}
				{
					cart?.length === 0 && (
						<div className="d-flex justify-content-center mt-5">
							<div
								className="bg-white p-4 text-center"
								style={{
									borderRadius: "12px",
									boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
									maxWidth: "300px",
									width: "100%"
								}}
							>
								<h6 className="mb-2">Your cart is empty 😔</h6>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => navigate("/")}
								>
									Explore Food
								</button>
							</div>
						</div>
					)
				}

				{/* 🔥 Cart Content */}
				{
					cart?.length > 0 && (
						<div className="row">

							{/* 🛒 Items */}
							<div className="col-12 col-lg-8">

								<div className="d-flex flex-column gap-3">
									{cart.map((c, i) => (
										<CartCards item={c} key={i} />
									))}
								</div>

							</div>

							{/* 💰 Summary */}
							<div className="col-12 col-lg-4 mt-4 mt-lg-0">

								<div
									className="bg-white p-3"
									style={{
										borderRadius: "12px",
										boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
									}}
								>

									<div className="d-flex justify-content-between mb-3">
										<span className="fw-semibold">Total Amount</span>
										<span className="fw-bold">
											<LiaRupeeSignSolid />{totalAmount}
										</span>
									</div>

									<button
										className="btn w-100"
										style={{
											background: "#FF4D4F",
											color: "#fff",
											borderRadius: "10px"
										}}
										onClick={() => navigate("/checkout")}
									>
										Proceed to Checkout
									</button>

								</div>

							</div>

						</div>
					)
				}

			</div>
		</div>
	)
}

export default Cart