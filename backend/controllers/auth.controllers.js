const User = require("../modals/user.modal.js");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const { sendMail } = require("../utils/mail.js");
const admin = require("../utils/firebase.js");
const userModal = require("../modals/user.modal.js");
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

		// res.cookie("token", token, {
		// 	secure: false,
		// 	sameSite: "strict",
		// 	maxAge: 7 * 24 * 60 * 60 * 1000,
		// 	httpOnly: true
		// })

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

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

			// res.cookie("token", token, {
			// 	secure: false,
			// 	sameSite: "strict",
			// 	maxAge: 7 * 24 * 60 * 60 * 1000,
			// 	httpOnly: true
			// })

			res.cookie("token", token, {
				httpOnly: true,
				secure: true,          //  MUST in production (HTTPS)
				sameSite: "none",      // cross-origin ke liye
				maxAge: 7 * 24 * 60 * 60 * 1000
			});

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
			secure: true,
			sameSite: "none",
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

// exports.authWithGoogle = async (req, res) => {
// 	try {
// 		const { fullname, email, googleId } = req.body;

// 		let user = await User.findOne({ email });

// 		if (!user) {
// 			user = await User.create({
// 				fullname,
// 				email,
// 				googleId
// 			});
// 		}
// 		else {
// 			if (!user.googleId && googleId) {
// 				user.googleId = googleId;
// 				await user.save();
// 			}
// 		}

// 		const isProfileComplete = user.mobile && user.role;

// 		const token = jwt.sign(
// 			{ userId: user._id, role: user.role },
// 			process.env.JWTSECRETKEY,
// 			{ expiresIn: "7d" }
// 		);

// 		// console.log("tokenddd", token)

// 		// res.cookie("token", token, {
// 		// 	httpOnly: true,
// 		// 	secure: true,
// 		// 	sameSite: "none",
// 		// 	maxAge: 7 * 24 * 60 * 60 * 1000
// 		// });

// 		res.cookie("token", token, {
// 			secure: false,
// 			sameSite: "strict",
// 			maxAge: 7 * 24 * 60 * 60 * 1000,
// 			httpOnly: true
// 		})

// 		const userObj = user.toObject();
// 		delete userObj.password;

// 		return res.json({
// 			success: true,
// 			user: userObj,
// 			isProfileComplete
// 		});

// 	} catch (error) {
// 		serverResponse(res, error.message, "auth google error");
// 	}
// };

exports.authWithGoogle = async (req, res) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ message: "Token required" });
		}

		const decoded = await admin.auth().verifyIdToken(token);
		console.log("decode", decoded)

		const firebaseUid = decoded.uid;
		const email = decoded.email || "";
		const fullname = decoded.name || "";

		let user = await User.findOne({ firebaseUid });

		if (!user) {
			if (!user) {
				let existingEmailUser = await User.findOne({ email });

				if (existingEmailUser && existingEmailUser.firebaseUid !== firebaseUid) {
					return res.status(400).json({
						message: "Email already in use"
					});
				}
				user = await User.create({
					firebaseUid,
					email
				});
			}
		} else {
			if (email && user.email !== email) user.email = email;
			if (fullname && user.fullname !== fullname) user.fullname = fullname;

			await user.save();
		}

		const isProfileComplete = user.mobile && user.role;

		const jwtToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWTSECRETKEY,
			{ expiresIn: "7d" }
		);

		// console.log("tokenddd", token)

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		// res.cookie("token", token, {
		// 	secure: false,
		// 	sameSite: "strict",
		// 	maxAge: 7 * 24 * 60 * 60 * 1000,
		// 	httpOnly: true
		// })

		const userObj = user.toObject();
		delete userObj.password;

		res.json({
			success: true,
			user: userObj,
			isProfileComplete
		});

	} catch (error) {
		console.error(error);
		res.status(401).json({ message: error.message });
	}
};

exports.completeProfile = async (req, res) => {
	try {
		let { mobile, role, fullname, email } = req.body;
		const { userId } = req;

		const user = await userModal.findById(userId);

		if (!user) {
			return errorResponse(res, "user not found");
		}

		if (email) {
			const existingUser = await userModal.findOne({ email: email })
			if (existingUser) {
				return errorResponse(res, "User with this email already exist")
			}
		}

		mobile = mobile || user.mobile;
		fullname = fullname || user.fullname;
		email = email || user.email;
		role = role || user.role;

		if (!mobile || !role || !fullname || !email) {
			return errorResponse(res, "missing credentials");
		}

		if (mobile !== user.mobile) user.mobile = mobile;
		if (fullname !== user.fullname) user.fullname = fullname;
		if (email !== user.email) user.email = email;
		if (role !== user.role) user.role = role;

		await user.save();
		const userObj = user.toObject();
		delete userObj.password;

		return successResponse(res, "profile completed", userObj);

	} catch (error) {
		serverResponse(res, error.message, "complete profile error");
	}
};





exports.authWithPhone = async (req, res) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ message: "Token required" });
		}

		const decoded = await admin.auth().verifyIdToken(token);

		const firebaseUid = decoded.uid;
		const phone = decoded.phone_number || "";

		if (!firebaseUid) {
			return res.status(400).json({ message: "Invalid token" });
		}

		let user = await userModal.findOne({ firebaseUid });

		if (!user) {
			let existingPhoneUser = await userModal.findOne({ mobile: phone });
			if (existingPhoneUser && existingPhoneUser.firebaseUid !== firebaseUid) {
				return res.status(400).json({
					message: "Phone already in use"
				});
			}

			user = await userModal.create({
				firebaseUid,
				mobile: phone,
			});
		} else {
			if (phone && user.mobile !== phone) {
				user.mobile = phone;
				await user.save();
			}
		}

		const isProfileComplete =
			user.fullname && user.email && user.role;

		const jwtToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWTSECRETKEY,
			{ expiresIn: "7d" }
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		const userObj = user.toObject();
		delete userObj.password;

		res.json({
			success: true,
			user: userObj,
			isProfileComplete,
		});

	} catch (error) {
		console.error(error);
		res.status(401).json({ message: error.message });
	}
};