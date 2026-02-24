const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	shop: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Shop",
		required: true
	},
	category: {
		type: String,
		enum: [
			"Fast Food",
			"Main Course",
			"Starters",
			"Snacks",
			"Desserts",
			"Beverages",
			"Chinese",
			"Street Food",
			"Sandwiches & Wraps",
			"Breakfast"
		],
		required: true
	},
	foodType: {
		type: String,
		enum: ["veg", "non-veg"]
	},
}, {
	timestamps: true
})

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;