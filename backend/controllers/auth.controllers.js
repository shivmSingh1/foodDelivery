const User = require("../modals/user.modal.js");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const { sendMail } = require("../utils/mail.js");

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
			password: hashPassword
		})

		const token = await jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWTSECRETKEY, { expiresIn: "7d" })
		console.log("token", token)

		res.cookie("token", token, {
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return successResponse(res, "user created Successfully", token)

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
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000
			})

			return successResponse(res, "user sign in successfully", { ...userDetail._doc, password: null, token })
		}

		return errorResponse(res, "incorrect password");

	} catch (error) {
		serverResponse(res, error, "signin error")
	}
}

exports.signout = async (req, res) => {
	try {
		res.clearCookie("token");
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

exports.authWithGoogle = async (req, res) => {
	try {
		const { fullname, email, phone: mobile, role } = req.body;
		let user = await User.findOne({ email })
		if (!user) {
			user = await User.create({
				fullname,
				mobile,
				email,
				role
			})
		}
		const token = await jwt.sign({ userId: user._id, role: user.role }, process.env.JWTSECRETKEY, { expiresIn: "7d" })

		res.cookie("token", token, {
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return successResponse(res, "sucess", token)
	} catch (error) {
		serverResponse(res, error.message, "auth google error")
	}
}