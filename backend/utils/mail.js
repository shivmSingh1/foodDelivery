const nodemailer = require("nodemailer");
require("dotenv").config()

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // Use true for port 465, false for port 587
	auth: {
		user: process.env.EMAIL,
		pass: process.env.APP_PASS,
	},
});


exports.sendMail = async (to, otp) => {
	try {
		console.log(process.env.EMAIL);
		console.log(to)
		const info = await transporter.sendMail({
			from: process.env.EMAIL,
			to: to,
			subject: "Reset your password",
			// text: "Hello world?", 
			html: `<b>otp to reset your password</b> ${otp}.expires in 5 minutes.`, // HT
		})
	} catch (error) {
		console.log(error.message, "mail send error")
	}
}