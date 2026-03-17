const mongoose = require("mongoose")

const deliveryAssignmentSchmea = new mongoose.Schema({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order"
	},
	shop: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Shop"
	},
	shopOrderId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	brodcastedTo: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null
	},
	status: {
		type: String,
		enum: ["brodcasted", "assigend", "completed"],
		default: "brodcasted"
	},
	acceptedAt: {
		type: Date
	}
}, { timestamps: true })

const DeliveryAssignment = mongoose.model("DeliveryAssignment", deliveryAssignmentSchmea);
module.exports = DeliveryAssignment;