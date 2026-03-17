const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	mobile: {
		type: Number,
		required: true
	},
	role: {
		type: String,
		enum: ["user", "owner", "deliveryBoy"]
	},
	otp: {
		type: String
	},
	otpExpires: {
		type: Date
	},
	isOtpVerified: {
		type: Boolean,
		default: false
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point"
		},
		coordinates: {
			type: [Number],
			default: [0, 0]
			// long,lat
		}
	}
}, { timestamps: true })

userSchema.index({ location: '2dsphere' })


module.exports = mongoose.model("User", userSchema);