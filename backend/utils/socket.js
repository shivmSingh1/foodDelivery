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

				console.log("✅ Identity set:", userId, socket.id);

			} catch (error) {
				console.log("identity socket error:", error.message);
			}
		});

		// DISCONNECT HANDLER
		socket.on("disconnect", async () => {
			try {
				console.log("❌ Disconnected:", socket.id);

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

		// ASSIGNMENT ACCEPTED - Notify other delivery boys
		socket.on("assignmentAccepted", async ({ assignmentId, deliveryBoyId }) => {
			try {
				console.log("🎯 Assignment accepted:", assignmentId, "by", deliveryBoyId);
				io.emit("assignmentRemoved", { assignmentId });
			} catch (error) {
				console.log("assignmentAccepted error:", error.message);
			}
		});

		// ORDER DELIVERED - Notify all parties
		socket.on("orderDelivered", async ({ orderId, assignmentId, deliveryBoyId }) => {
			try {
				console.log("✅ Order delivered:", orderId, "by", deliveryBoyId);
				io.emit("orderDeliveryCompleted", { orderId, assignmentId });
			} catch (error) {
				console.log("orderDelivered error:", error.message);
			}
		});

		// ORDER STATUS UPDATED - Notify relevant parties
		socket.on("orderStatusChanged", async ({ orderId, newStatus, recipients }) => {
			try {
				console.log("📊 Order status changed:", orderId, "to", newStatus);
				if (recipients && recipients.length > 0) {
					recipients.forEach(recipientId => {
						const user = io.sockets.sockets.get(recipientId);
						if (user) {
							io.to(recipientId).emit("order:status:update", {
								orderId,
								status: newStatus
							});
						}
					});
				} else {
					io.emit("order:status:update", { orderId, status: newStatus });
				}
			} catch (error) {
				console.log("orderStatusChanged error:", error.message);
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