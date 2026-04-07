import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import './Spinner.css';

function LoaderSpinner() {
	const { isLoading, loadingMessage } = useSelector(state => state.loader);

	if (!isLoading) return null;

	return (
		<div className="loader-overlay">
			<div className="loader-container">
				<Spinner animation="border" role="status" className="spinner-custom">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
				{loadingMessage && <p className="loading-message">{loadingMessage}</p>}
			</div>
		</div>
	);
}

export default LoaderSpinner;
