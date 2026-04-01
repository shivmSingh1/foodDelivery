const User = require("../modals/user.modal.js");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const { sendMail } = require("../utils/mail.js");
require("dotenv").config()

exports.signup = async (req, res) => {
	try {
		console.log("req.body", req.body)
		const { fullname, email, password, phone: mobile, role } = req.body;
		if (!fullname || !email || !password || !mobile || !role) {
			return errorResponse(res, "missing fields")
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return errorResponse(res, "user already exists")
		}

		const hashPassword = await bcrypt.hash(password, 10);
		console.log("hashpassword", hashPassword);

		const newUser = await User.create({
			fullname,
			email,
			mobile,
			password: hashPassword,
			role
		})

		const token = await jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWTSECRETKEY, { expiresIn: "7d" })
		console.log("token", token)

		res.cookie("token", token, {
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		// res.cookie("token", token, {
		// 	httpOnly: true,
		// 	secure: true,          //  MUST in production (HTTPS)
		// 	sameSite: "none",      // cross-origin ke liye
		// 	maxAge: 7 * 24 * 60 * 60 * 1000
		// });

		const userObj = newUser.toObject();
		delete userObj.password;

		return successResponse(res, "user created Successfully", userObj)

	} catch (error) {
		serverResponse(res, error, "signup error")
	}
}

exports.signin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return errorResponse(res);
		}

		const userDetail = await User.findOne({ email });

		if (!userDetail) {
			return errorResponse(res, "user not found");
		}

		if (await bcrypt.compare(password, userDetail.password)) {
			const token = jwt.sign({ userId: userDetail._id, role: userDetail.role }, process.env.JWTSECRETKEY, { expiresIn: "7d" })

			res.cookie("token", token, {
				secure: false,
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: true
			})

			const userObj = userDetail.toObject();
			delete userObj.password;

			return successResponse(res, "user sign in successfully", userObj)
		}

		return errorResponse(res, "incorrect password");

	} catch (error) {
		serverResponse(res, error, "signin error")
	}
}

exports.signout = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		});
		successResponse(res, "user logout successfuly")
	} catch (error) {
		serverResponse(res, error, "singout error")
	}
}

exports.sendOtp = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return errorResponse(res, "user does not exist with this email");
		}

		const otp = crypto.randomInt(100000, 1000000);
		user.otp = otp;
		user.otpExpires = Date.now() + 5 * 60 * 1000;
		user.isOtpVerified = false;

		console.log("here")
		await sendMail(email, otp);
		await user.save();

		const userObj = user.toObject();
		delete userObj.password;
		delete userObj.createdAt;
		delete userObj.updatedAt;

		return successResponse(res, "otp send sucessfully", { userObj })
	} catch (error) {
		serverResponse(res, error.message, "opt sending error")
	}
}

exports.verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;
		if (!otp || !email) {
			return errorResponse(res, "missing fields");
		}
		const user = await User.findOne({ email });

		if (otp !== user.otp || user.otp > Date.now()) {
			return errorResponse(res, "invalid or expired otp")
		}

		userObj = user.toObject()
		userObj.otp = undefined;
		userObj.otpExpires = undefined;
		userObj.isOtpVerified = true;

		await user.save()

		return successResponse(res, "otp verify sucessfully", { isOtpverified: userObj.isOtpVerified })
	} catch (error) {
		serverResponse(res, error.message, "verify otp error")
	}
}

exports.resetPassword = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return errorResponse(res, "missing email");
		}
		const user = await User.findOne({ email })
		const hashPassword = await bcrypt.hash(password, 10);

		user.password = hashPassword;
		user.save()

		return successResponse(res, "password updated sucessfully")

	} catch (error) {
		serverResponse(res, error.message, "resetPassword error")
	}
}

// exports.authWithGoogle = async (req, res) => {
// 	try {
// 		const { fullname, email, phone: mobile, role } = req.body;
// 		// if (!role) {
// 		// 	return errorResponse(res, "role is missing")
// 		// }
// 		let user = await User.findOne({ email });
// 		let isNew = false;
// 		if (!user) {
// 			user = await User.create({
// 				fullname,
// 				mobile,
// 				email,
// 				role
// 			})
// 			isNew = true
// 		}

// 		if (!isNew && mobile) {
// 			return errorResponse(res, "account with this email already existed", null);
// 		}

// 		const token = await jwt.sign({ userId: user._id, role: user.role }, process.env.JWTSECRETKEY, { expiresIn: "7d" })

// 		console.log("token", token)

// 		res.cookie("token", token, {
// 			secure: false,
// 			sameSite: "strict",
// 			maxAge: 7 * 24 * 60 * 60 * 1000,
// 			httpOnly: true
// 		})

// 		return successResponse(res, "sucess", token)
// 	} catch (error) {
// 		serverResponse(res, error.message, "auth google error")
// 	}
// }

exports.authWithGoogle = async (req, res) => {
	try {
		const { fullname, email, googleId } = req.body;

		let user = await User.findOne({ email });

		if (!user) {
			user = await User.create({
				fullname,
				email,
				googleId
			});
		}
		else {
			if (!user.googleId && googleId) {
				user.googleId = googleId;
				await user.save();
			}
		}

		const isProfileComplete = user.mobile && user.role;

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWTSECRETKEY,
			{ expiresIn: "7d" }
		);

		console.log("tokenddd", token)

		// res.cookie("token", token, {
		// 	httpOnly: true,
		// 	secure: true,
		// 	sameSite: "none",
		// 	maxAge: 7 * 24 * 60 * 60 * 1000
		// });

		res.cookie("token", token, {
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		const userObj = user.toObject();
		delete userObj.password;

		return res.json({
			success: true,
			user: userObj,
			isProfileComplete
		});

	} catch (error) {
		serverResponse(res, error.message, "auth google error");
	}
};

exports.completeProfile = async (req, res) => {
	try {
		const { mobile, role } = req.body;
		const { userId } = req; // from auth middleware

		if (!mobile || !role) {
			return errorResponse(res, "phone and role required");
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ mobile, role },
			{ new: true }
		);

		return successResponse(res, "profile completed", user);

	} catch (error) {
		serverResponse(res, error.message, "complete profile error");
	}
};