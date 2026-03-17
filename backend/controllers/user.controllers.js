const User = require("../modals/user.modal");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")

exports.getCurrentUser = async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return errorResponse(res, "user id not found");
		}
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return errorResponse(res, "user not found");
		}
		const userObj = user.toObject();
		delete userObj.password;
		return successResponse(res, "user found successfully", userObj)
	} catch (error) {
		serverResponse(res, error, "get current user error")
	}
}

exports.updatedLocation = async (req, res) => {
	try {
		const { userId } = req;
		const { long, lat } = req.body;
		if (lat === undefined || long === undefined) {
			return errorResponse(res, "missing fields");
		}
		const updatedUser = await User.findByIdAndUpdate(userId, {
			location: {
				type: "Point",
				coordinates: [long, lat]
			}
		}, { new: true })

		if (!updatedUser) {
			return errorResponse(res, "cant find user");
		}
		successResponse(res, "location updated successfully", updatedUser.location)
	} catch (error) {
		serverResponse(res, error, "error in updating user location")
	}
}