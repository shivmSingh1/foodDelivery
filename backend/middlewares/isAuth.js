const userModal = require("../modals/user.modal");
const { errorResponse } = require("../utils/responses");
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.isAuth = async (req, res, next) => {
	try {
		let token;

		if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
		}
		else if (req.headers.authorization) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return errorResponse(res, "token not found");
		}

		console.log("token", token)

		const decode = jwt.verify(token, process.env.JWTSECRETKEY);

		if (!decode) {
			return errorResponse(res, "token not verify");
		}

		req.userId = decode.userId;

		next();
	} catch (error) {
		console.log("is auth error", error.message);

		// Return 401 status for token-related errors
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ success: false, message: "invalid token" });
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ success: false, message: "token expired" });
		}

		return res.status(401).json({ success: false, message: "authentication failed" });
	}
};