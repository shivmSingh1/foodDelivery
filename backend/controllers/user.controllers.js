const userModal = require("../modals/user.modal");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")

exports.getCurrentUser = async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return errorResponse(res, "user id not found");
		}
		const user = await userModal.findOne({ _id: userId });
		if (!user) {
			return errorResponse(res, "user not found");
		}
		const userObj = user.toObject();
		delete userObj.password;
		return successResponse(res, "user found successfully", userObj)
	} catch (error) {
		serverResponse(res, error.message, "get current user error")
	}
}