const Shop = require("../modals/shop.modal");
const uploadToCloudinary = require("../utils/cloudinary");
const { errorResponse, serverResponse, successResponse } = require("../utils/responses")

exports.createOrEditShop = async (req, res) => {
	try {
		console.log(req.body, "body")
		console.log(req.file)
		const { userId } = req
		const { name, city, state, address } = req.body

		let image

		if (req.file) {
			image = await uploadToCloudinary(req.file.path)

		}

		console.log("imageeeeee", image)

		const updatedShop = await Shop.findOneAndUpdate(
			{ owner: userId },
			{
				owner: userId,
				name,
				city,
				state,
				address,
				...(image && { image })
			},
			{ new: true, upsert: true }
		)

		return successResponse(
			res,
			"Shop updated or created successfully",
			updatedShop
		)

	} catch (error) {
		serverResponse(res, error, "create or edit shop error")
	}
}


exports.getShops = async (req, res) => {
	try {
		const { userId } = req;
		const shops = await Shop.find({ owner: userId }).populate(["items", "owner"]);

		if (!shops || shops.length === 0) {
			return successResponse(res, "no shop found")
		}

		successResponse(res, "shops fetched successfully", shops)
	} catch (error) {
		serverResponse(res, error, "get shop error")
	}
}