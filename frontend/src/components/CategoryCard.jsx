import React from 'react'


function CategoryCard({ category }) {
	return (
		<div className='d-flex flex-column gap-1 ' >
			<div style={{ width: "100px", height: "100px" }}>
				<img src={category?.image} alt={category?.name} className=" object-fit-cover" style={{ minWidth: "100px", maxWidth: "100px", height: "100px" }} />
			</div>
			<p className='text-center' >{category?.name}</p>
		</div>
	)
}

export default CategoryCard