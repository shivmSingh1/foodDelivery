import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import FoodItemsCard from "./FoodItemsCard";
import { IoArrowBack } from "react-icons/io5";

function ShopItemsPage() {
	const { shopId } = useParams();

	const [shop, setShop] = useState(null);
	const [items, setItems] = useState([]);
	const navigate = useNavigate()

	const fetchShopItems = async () => {
		try {
			const res = await axios.get(
				`${serverUrl}/item/items/${shopId}`,
				{ withCredentials: true }
			);

			console.log("Shop Items Data 👉", res.data);

			if (res.data.success) {
				setShop(res.data.shop);
				setItems(res.data.items);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (shopId) {
			fetchShopItems();
		}
	}, [shopId]);

	return (
		<div className="container mt-4">
			<div onClick={() => navigate(-1)} >
				<IoArrowBack size={25} />
			</div>
			{/* 🔹 Shop Details */}
			{shop && (
				<div className="border rounded p-3 mb-4">
					<h3>{shop?.name}</h3>
					<p className="mb-1">{shop?.address}</p>
					<small className="text-muted">
						{shop?.city}, {shop?.state}
					</small>

					<div className="mt-2">
						<img
							src={shop?.image}
							alt={shop?.name}
							style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
							className="rounded"
						/>
					</div>
				</div>
			)}

			{/* 🔹 Items List */}
			<div>
				<h5>Available Items</h5>

				<div className="d-flex flex-wrap gap-3">
					{items?.map((item, index) => (
						<FoodItemsCard key={index} item={item} />
					))}
				</div>
			</div>
		</div>
	);
}

export default ShopItemsPage;