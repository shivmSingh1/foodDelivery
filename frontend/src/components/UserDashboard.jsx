import React, { useRef } from 'react'
import Nav from './Nav'
import categories from '../utils/categories'
import CategoryCard from './CategoryCArd'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function UserDashboard() {
	const categoriesRef = useRef()

	const scrollLeft = () => {
		categoriesRef.current?.scrollBy({
			left: -200,
			behavior: "smooth",
		})
	}

	const scrollRight = () => {
		categoriesRef.current?.scrollBy({
			left: 200,
			behavior: "smooth",
		})
	}

	return (
		<div className="container">
			<Nav isUser={true} isOwner={false} />

			<div className="d-flex justify-content-center mt-4">
				<div
					className="position-relative"
					style={{ width: "500px", height: "130px" }}
				>
					{/* Scrollable Row */}
					<div
						ref={categoriesRef}
						className="d-flex gap-2 overflow-auto hide-scrollbar smooth-scroll h-100"
					>
						{categories?.map((category, index) => (
							<CategoryCard key={index} category={category} />
						))}
					</div>

					{/* Left Arrow */}
					<span
						className="position-absolute top-50 start-0 arrow-btn"
						style={{ transform: "translateY(-90%)" }}
						onClick={scrollLeft}
					>
						<IoIosArrowBack size={30} />
					</span>

					{/* Right Arrow */}
					<span
						className="position-absolute top-50 end-0 arrow-btn"
						style={{ transform: "translateY(-90%)" }}
						onClick={scrollRight}
					>
						<IoIosArrowForward size={30} />
					</span>
				</div>
			</div>
		</div>
	)
}

export default UserDashboard