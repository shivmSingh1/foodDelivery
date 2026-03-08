const userModal = require("../modals/user.modal");
const { errorResponse } = require("../utils/responses");
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.isAuth = async (req, res, next) => {
	try {
		console.log(req)
		const token = req.cookies.token || req.headers.authorization.split(" ")[1];
		if (!token) {
			return errorResponse(res, "token not found", undefined)
		}
		const decode = await jwt.verify(token, process.env.JWTSECRETKEY)
		if (!decode) {
			return errorResponse(res, "token not verify", undefined)
		}
		req.userId = decode.userId
		next()
	} catch (error) {
		console.log("is auth error", error.message)
	}
}