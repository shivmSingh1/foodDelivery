const Shop = require("../modals/shop.modal");
const uploadToCloudinary = require("../utils/cloudinary");
const { errorResponse, serverResponse, successResponse } = require("../utils/responses")

exports.createOrEditShop = async (req, res) => {
	try {
		const { userId } = req
		const { name, city, state, address } = req.body

		let image

		if (req.file) {
			image = await uploadToCloudinary(req.file.path)

		}

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
