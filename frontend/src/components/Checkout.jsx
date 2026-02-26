import React from 'react'
import GoogleAddressInput from './GoogleAddressInput'
import { IoArrowBack } from 'react-icons/io5'

function Checkout() {
	return (
		<div className='container' >
			<span className='mt-4' onClick={() => navigate(-1)} ><IoArrowBack size={25} /></span>
			<div>
				<div>
					<h4>Checkout</h4>
					<div>
						<GoogleAddressInput />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout