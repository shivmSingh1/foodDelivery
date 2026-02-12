exports.errorResponse = (res, msg = "invalid or missing entries", data = []) => {
	return res.status(400).json({
		success: false,
		message: msg,
		data,
	})
}

exports.successResponse = (res, msg = sucess, data = []) => {
	return res.status(200).json({
		success: true,
		message: msg,
		data
	})
}

exports.serverResponse = (res, error, msg = "something went wrong") => {
	return res.status(500).json({
		success: false,
		message: msg,
		error: error.message
	})
}