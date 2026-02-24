const cloudinary = require('cloudinary').v2;
require("dotenv").config()
const fs = require("fs")
const uploadToCloudinary = async (file) => {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_APIKEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
	try {
		const result = await cloudinary.uploader.upload(file)
		fs.unlinkSync(file)
		return result.secure_url
	} catch (error) {
		console.log(error.message, "upload to cloudinary error")
	}
}

module.exports = uploadToCloudinary;