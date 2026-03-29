
const Item = require("../modals/item.modal.js");
const Shop = require("../modals/shop.modal.js");
const uploadToCloudinary = require("../utils/cloudinary");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")

exports.createItem = async (req, res) => {
	try {
		const { name, category, foodType, price } = req.body;
		const shop = await Shop.findOne({ owner: req.userId });
		if (!shop) {
			return errorResponse(res, "shop does not exist");
		}
		let image;
		if (req.file) {
			image = await uploadToCloudinary(req.file.path)
		}
		const newItem = await Item.create({
			name,
			image,
			category,
			foodType,
			shop: shop._id,
			price
		})
		shop.items.push(newItem._id);
		await shop.populate(["items", "owner"])
		await shop.save()

		return successResponse(res, "item created successFully", shop);
	} catch (error) {
		serverResponse(res, error, "create item error")
	}
}

exports.updateItem = async (req, res) => {
	try {
		const { name, category, foodType } = req.body;
		const { id: itemId } = req.params;
		if (!itemId) {
			return errorResponse(res, "item id is missing");
		}
		const shop = await Shop.findOne({ owner: req.userId })

		let image;
		if (req.file) {
			image = await uploadToCloudinary(req.file.path);
		}

		const updatedItem = await Item.findByIdAndUpdate(itemId, {
			name,
			category,
			foodType,
			image
		}, { new: true, runValidators: true })

		if (!updatedItem) {
			return errorResponse(res, "Item not found");
		}
		await shop.populate(["items", "owner"])
		return successResponse(res, "item updated successfully", shop)
	} catch (error) {
		serverResponse(res, error, "create item error")
	}
}

exports.deleteItem = async (req, res) => {
	try {
		const { userId } = req;
		const { id } = req.params;
		console.log(id)
		const shop = await Shop.findOne({ owner: userId })
		const deletedItem = await Item.findByIdAndDelete(id)
		if (!deletedItem) {
			return errorResponse(res, "item not found")
		}
		shop.items.pull(deletedItem._id)
		await shop.populate(["items", "owner"]);
		await shop.save()
		return successResponse(res, "item deleted successfully", [shop])
	} catch (error) {
		serverResponse(res, error, "delete item error")
	}
}

exports.getItemById = async (req, res) => {
	try {
		const { id } = req.params;
		const itemDetail = await Item.findById(id);
		if (!itemDetail) {
			return errorResponse(res, "item details not found")
		}
		return successResponse(res, "item detail fetched successfully", itemDetail)
	} catch (error) {
		serverResponse(res, error, "get item by id error")
	}
}

exports.getItemsByCity = async (req, res) => {
	try {
		const { userId } = req;
		const { city } = req.query;
		if (!city) {
			return errorResponse(res, "required city for item suggestion")
		}

		const items = await Shop.find({
			city: { $regex: new RegExp(`^${city}$`, "i") },
		}).populate("items").select("items")

		if (!items || items.length <= 0) {
			errorResponse(res, "no item found in the city")
		}
		console.log(items)
		successResponse(res, "items fetched successfully", items)
	} catch (error) {
		serverResponse(res, error, "get item by city error")
	}
}

exports.getItemsByShop = async (req, res) => {
	try {
		const { shopId } = req.params;

		const shop = await Shop.findById(shopId).populate("items");

		if (!shop) {
			return res.status(400).json({
				success: false,
				message: "Shop not found",
			});
		}

		return res.status(200).json({
			success: true,
			shop,
			items: shop.items,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Get items by shop error",
			error: error.message,
		});
	}
};

exports.searchItems = async (req, res) => {
	try {
		const { query, city } = req.query;

		if (!query || !city) {
			return res.status(400).json({
				success: false,
				message: "Query and city are required",
			});
		}

		// 🔹 Find shops in that city
		const shops = await Shop.find({
			city: { $regex: new RegExp(`^${city}$`, "i") },
		}).populate("items");

		if (!shops || shops.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Shops not found",
			});
		}

		// 🔹 Get shop IDs
		const shopIds = shops.map((s) => s._id);

		// 🔹 Find items based on query
		const items = await Item.find({
			shop: { $in: shopIds },
			$or: [
				{ name: { $regex: `^${query}`, $options: "i" } },
				// { category: { $regex: `^${query}`, $options: "i" } },
			],
		}).populate("shop", "name image");

		return res.status(200).json({
			success: true,
			items,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Search item error",
			error: error.message,
		});
	}
};