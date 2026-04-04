import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Footer() {
	const navigate = useNavigate()
	const currentYear = new Date().getFullYear()

	return (
		<footer style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", color: "#fff", marginTop: "60px" }}>

			{/* 🔥 Main Content */}
			<div className="container-fluid py-5">
				<div className="container">
					<div className="row g-4">

						{/* 🏢 Company Info */}
						<div className="col-12 col-md-3">
							<h5 className="fw-bold mb-3" style={{ color: "#FF4D4F" }}>
								🍕 FoodDelivery
							</h5>
							<p className="text-light small mb-3">
								Fast, fresh, and delicious food delivered to your doorstep.
							</p>
							<div className="d-flex gap-2">
								<a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.1)" }}>
									<FaFacebook color="#FF4D4F" />
								</a>
								<a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.1)" }}>
									<FaTwitter color="#FF4D4F" />
								</a>
								<a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.1)" }}>
									<FaInstagram color="#FF4D4F" />
								</a>
								<a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.1)" }}>
									<FaLinkedin color="#FF4D4F" />
								</a>
							</div>
						</div>

						{/* 📍 Quick Links */}
						<div className="col-12 col-md-3">
							<h6 className="fw-bold mb-3" style={{ color: "#FF4D4F" }}>Quick Links</h6>
							<ul className="list-unstyled">
								<li className="mb-2">
									<span onClick={() => navigate("/")} style={{ cursor: "pointer" }} className="text-decoration-none text-light small hover-link fw-500">
										Home
									</span>
								</li>
								<li className="mb-2">
									<span onClick={() => navigate("/")} style={{ cursor: "pointer" }} className="text-decoration-none text-light small hover-link">
										Browse Restaurants
									</span>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										My Orders
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Support
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Pricing
									</a>
								</li>
							</ul>
						</div>

						{/* 🤝 For Partners */}
						<div className="col-12 col-md-3">
							<h6 className="fw-bold mb-3" style={{ color: "#FF4D4F" }}>For Partners</h6>
							<ul className="list-unstyled">
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Partner With Us
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Become a Delivery Boy
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Admin Panel
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Success Stories
									</a>
								</li>
								<li className="mb-2">
									<a href="#" className="text-decoration-none text-light small hover-link">
										Careers
									</a>
								</li>
							</ul>
						</div>

						{/* 📞 Contact Info */}
						<div className="col-12 col-md-3">
							<h6 className="fw-bold mb-3" style={{ color: "#FF4D4F" }}>Contact Us</h6>
							<div className="mb-3">
								<div className="d-flex align-items-start gap-2 mb-2">
									<FaPhone size={14} style={{ marginTop: "2px", color: "#FF4D4F" }} />
									<div>
										<p className="small mb-0 text-light">+91 9876543210</p>
									</div>
								</div>
								<div className="d-flex align-items-start gap-2 mb-2">
									<FaEnvelope size={14} style={{ marginTop: "2px", color: "#FF4D4F" }} />
									<div>
										<p className="small mb-0 text-light">support@fooddelivery.com</p>
									</div>
								</div>
								<div className="d-flex align-items-start gap-2">
									<FaMapMarkerAlt size={14} style={{ marginTop: "2px", color: "#FF4D4F" }} />
									<div>
										<p className="small mb-0 text-light">123 Food Street, Delhi 110001</p>
									</div>
								</div>
							</div>
						</div>

					</div>

					{/* 🔥 Divider */}
					<hr style={{ background: "rgba(255,255,255,0.1)", margin: "40px 0" }} />

					{/* 🔥 Bottom Section */}
					<div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
						<p className="text-light small mb-2 mb-md-0">
							© {currentYear} FoodDelivery. All rights reserved.
						</p>
						<div className="d-flex gap-4">
							<a href="#" className="text-light small text-decoration-none hover-link">Privacy Policy</a>
							<a href="#" className="text-light small text-decoration-none hover-link">Terms & Conditions</a>
							<a href="#" className="text-light small text-decoration-none hover-link">Cookie Policy</a>
						</div>
					</div>

				</div>
			</div>

			{/* 🔥 Inline Styles */}
			<style>{`
				.hover-link {
					transition: color 0.3s ease;
				}
				.hover-link:hover {
					color: #FF4D4F !important;
				}
			`}</style>

		</footer>
	)
}

export default Footer
