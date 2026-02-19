
const Item = require("../modals/item.modal.js");
const Shop = require("../modals/shop.modal.js");
const uploadToCloudinary = require("../utils/cloudinary");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")

exports.createItem = async (req, res) => {
	try {
		const { name, category, foodType } = req.body;
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
			shop: shop._id
		})
		return successResponse(res, "item created successFully");
	} catch (error) {
		serverResponse(res, error, "create item error")
	}
}

exports.updateItem = async (req, res) => {
	try {
		const { name, category, foodType } = req.body;
		const { itemId } = req.params;
		if (!itemId) {
			return errorResponse(res, "item id is missing");
		}

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

		return successResponse(res, "item updated successfully", updatedItem)
	} catch (error) {
		serverResponse(res, error, "create item error")
	}
}