const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URL)
		console.log("Database connected successfully")
	} catch (error) {
		console.log("something went wrong while connecting database")
		// process.exist(1);
	}
}

module.exports = dbConnect;