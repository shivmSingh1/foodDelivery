const admin = require("firebase-admin");
require("dotenv").config()

let serviceAccount;

try {
	if (process.env.FIREBASE_SERVICE_ACCOUNT) {
		serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
	} else {
		throw new Error("FIREBASE_SERVICE_ACCOUNT not found in .env");
	}
} catch (error) {
	console.error(" Firebase Service Account Error:", error.message);
	console.log("Make sure FIREBASE_SERVICE_ACCOUNT is set correctly in .env file");
	process.exit(1);
}

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

module.exports = admin;