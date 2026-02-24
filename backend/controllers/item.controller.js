
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