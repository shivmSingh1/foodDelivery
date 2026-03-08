const mongoose = require("mongoose");

const shopOrderItemSchema = new mongoose.Schema({
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item"
	},
	image: {
		type: String
	},
	name: {
		type: String
	},
	price: Number,
	quantity: Number
}, { timestamps: true })

const shopOrderSchema = new mongoose.Schema({
	shop: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Shop"
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	subTotal: {
		type: Number
	},
	shopOrderItems: [shopOrderItemSchema]
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	paymentMethod: {
		type: String,
		enum: ["cod", "online"],
		required: true
	},
	deliveryAddress: {
		text: String,
		lattitude: Number,
		longitude: Number
	},
	totalAmount: {
		type: Number
	},
	shopOrder: [shopOrderSchema],
	status: {
		type: String,
		enum: ["pending", "preparing", "delivered", "out for delivery"],
		default: "pending"
	}
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;