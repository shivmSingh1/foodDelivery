// const userModal = require("../modals/user.modal")

// exports.socketHandler = (io) => {
// 	io.on("connection", (socket) => {
// 		socket.on("identity", async ({ userId }) => {
// 			try {
// 				const user = await userModal.findOneAndUpdate({ _id: userId }, {
// 					$addToSet: {
// 						socketIds: socket.id
// 					},
// 					isOnline: true
// 				}, { new: true })
// 			} catch (error) {
// 				console.log("identity socket error", error.message)
// 			}
// 		})

// 		socket.on("disconnect", async () => {
// 			try {
// 				const user = await userModal.findOneAndUpdate({ socketIds: socket.id }, {
// 					$pull: { socketIds: socket.id },
// 				}, { new: true })

// 				if (user && user.socketIds.length === 0) {
// 					user.isOnline = false;
// 					await user.save();
// 				}

// 			} catch (error) {
// 				console.log("identity socket error", error.message)
// 			}
// 		})
// 	})
// }

const userModal = require("../modals/user.modal");

exports.socketHandler = (io) => {

	io.on("connection", (socket) => {

		console.log("🔌 New connection:", socket.id);
		socket.on("identity", async ({ userId }) => {
			try {
				if (!userId) return;
				await userModal.updateMany(
					{ socketIds: socket.id },
					{ $pull: { socketIds: socket.id } }
				);

				const user = await userModal.findByIdAndUpdate(
					userId,
					{
						$addToSet: { socketIds: socket.id },
						isOnline: true
					},
					{ new: true }
				);

				// console.log(" Identity set:", userId, socket.id);

			} catch (error) {
				console.log("identity socket error:", error.message);
			}
		});

		// DISCONNECT HANDLER
		socket.on("disconnect", async () => {
			try {
				// console.log(" Disconnected:", socket.id);

				const user = await userModal.findOneAndUpdate(
					{ socketIds: socket.id },
					{ $pull: { socketIds: socket.id } },
					{ new: true }
				);

				if (user) {
					if (!user.socketIds || user.socketIds.length === 0) {
						user.isOnline = false;
						await user.save();
					}
				}

			} catch (error) {
				console.log(" disconnect error:", error.message);
			}
		});

	});

	setInterval(async () => {
		try {
			const users = await userModal.find();

			for (let user of users) {
				const validSockets = (user.socketIds || []).filter(
					id => io.sockets.sockets.get(id)
				);

				if (validSockets.length !== user.socketIds.length) {
					user.socketIds = validSockets;

					if (validSockets.length === 0) {
						user.isOnline = false;
					}

					await user.save();
				}
			}

		} catch (error) {
			console.log("cleanup error:", error.message);
		}
	}, 30000);
};