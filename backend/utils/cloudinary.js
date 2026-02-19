const cloudinary = require('cloudinary').v2;
const uploadToCloudinary = async (file) => {
	cloudinary.config({
		cloud_name: 'my_cloud_name',
		api_key: 'my_key',
		api_secret: 'my_secret'
	});
	try {
		const result = await cloudinary.uploader.upload(file)
		return result.secure_url
	} catch (error) {
		console.log(error.message, "upload to cloudinary error")
	}
}

module.exports = uploadToCloudinary;