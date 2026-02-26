import React from 'react'

function Checkout() {
	return (
		<div className='container' >
			<span className='mt-4' onClick={() => navigate(-1)} ><IoArrowBack size={25} /></span>
			<div>
				<div>
					<h4>Checkout</h4>
					<input type="text" />
				</div>
			</div>
		</div>
	)
}

export default Checkout