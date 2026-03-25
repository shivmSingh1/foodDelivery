const DeliveryAssignment = require("../modals/deliveryAssignment.modal");
const Order = require("../modals/orderModal");
const Shop = require("../modals/shop.modal");
const userModal = require("../modals/user.modal");
const { serverResponse, errorResponse, successResponse } = require("../utils/responses")

exports.placeOrder = async (req, res) => {
	try {
		const { paymentMode: paymentMethod, deliveryAddress, totalAmount, cart } = req.body;
		const { userId } = req;

		if (!cart || cart.length <= 0) {
			return errorResponse(res, "cart is empty");
		}

		if (!deliveryAddress.lat || !deliveryAddress.text || !deliveryAddress.long) {
			return errorResponse(res, "send complete delivery address");
		}

		if (!paymentMethod || !totalAmount) {
			return errorResponse(res, "Missing payload");
		}

		const groupItemsByShop = {}

		cart?.forEach(item => {
			if (!groupItemsByShop[item.shop]) {
				groupItemsByShop[item.shop] = []
			}
			groupItemsByShop[item.shop].push(item)
		});

		// {
		// 	"q3423423423qew":[{item1},{item2}],
		// 	"werwr34r342432":[{item1}]
		// }

		const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
			const shop = await Shop.findById(shopId);
			if (!shop) {
				return errorResponse("res", "shop not found")
			}

			const items = groupItemsByShop[shopId]
			// items= [{item1},{item2}]

			const subTotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

			return {
				shop: shop?._id,
				owner: shop?.owner,
				subTotal,
				shopOrderItems: items.map((i) => ({
					item: i._id,
					price: i.price,
					quantity: i.quantity,
					image: i.image,
					name: i.name
				}))
			}
		}))

		const formattedDeliveryAddress = {
			text: deliveryAddress?.text,
			longitude: deliveryAddress?.long,
			lattitude: deliveryAddress?.lat
		}

		const newOrder = await Order.create({
			user: userId,
			paymentMethod,
			deliveryAddress: formattedDeliveryAddress,
			totalAmount,
			shopOrder: shopOrders
		})

		return successResponse(res, "success", newOrder)
	} catch (error) {
		serverResponse(res, error, "place order error")
	}
}

exports.getOrders = async (req, res) => {
	try {
		const { userId } = req;
		const orderList = await Order.find({ user: userId }).populate(["shopOrder.shop", "shopOrder.owner", "shopOrder.assignedDeliveryBoy"])
		if (!orderList || orderList.length <= 0) {
			return successResponse(res, "order list is empty")
		}

		// console.log("orderlist", orderList)

		const itemsByShops = {
			id: orderList?.[0]?._id,
			order: orderList,
			date: orderList?.[0]?.createdAt,
			totalAmount: orderList?.[0]?.totalAmount
		}

		successResponse(res, "order fetched successfully", itemsByShops)
	} catch (error) {
		serverResponse(res, error, "get orders error")
	}
}

exports.getOwnerOrder = async (req, res) => {
	try {
		const { userId } = req;
		console.log(userId)
		const orders = await Order.find({ shopOrder: { $elemMatch: { owner: userId } } }).populate({
			path: "user",
			select: "-password"
		})
		const filteredOrders = orders.map(order => ({
			...order.toObject(),
			shopOrder: order.shopOrder.filter(
				shop => shop.owner.toString() === userId
			)
		}));
		if (!filteredOrders || filteredOrders.length <= 0) {
			return successResponse(res, "order is empty")
		}
		successResponse(res, "orders fetched successfully", filteredOrders)
	} catch (error) {
		console.log(error.message)
		serverResponse(res, error, "get owner order error")
	}
}

exports.updateOrderStatus = async (req, res) => {
	try {
		const { status, orderId, shopId } = req.body;
		// console.log(status, "or", orderId, "sh", shopId)
		if (!status) {
			return errorResponse(res, "missing status")
		}
		const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true }).populate("shopOrder.shop").populate("shopOrder.assignedDeliveryBoy")
		if (!updatedOrder) {
			return errorResponse(res, "order not found")
		}

		if (!updatedOrder.shopOrder || updatedOrder.shopOrder.length === 0) {
			return errorResponse(res, "no shop orders found")
		}

		// console.log("shopId received:", shopId);
		// console.log("shopOrder array:", updatedOrder.shopOrder.map(s => ({ shop: s.shop, shopId: s.shop?._id || s.shop })));

		const shopOrder = updatedOrder.shopOrder?.find((order) => {
			const orderShopId = order.shop?._id ? order.shop._id.toString() : order.shop.toString();
			return orderShopId === shopId.toString();
		})
		let deliveryBoysPayload = [];
		// console.log("status", status)
		if (status == "out for delivery" || !shopOrder?.assignment) {
			if (!shopOrder) {
				return errorResponse(res, "shop order not found")
			}
			const { lattitude, longitude } = updatedOrder.deliveryAddress;
			const nearByDeliveryBoys = await userModal.find({
				role: "deliveryBoy",
				location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [Number(longitude), Number(lattitude)]
						},
						$maxDistance: 5000
					}
				}
			})

			if (!nearByDeliveryBoys || nearByDeliveryBoys.length === 0) {
				return errorResponse(res, "delivery boys are not available right now")
			}

			const deliveryBoysIds = nearByDeliveryBoys?.map((boys) => boys._id);

			const busyIds = await DeliveryAssignment.distinct("assignedTo", {
				assignedTo: { $in: deliveryBoysIds },
				status: { $nin: ["brodcasted", "completed"] }
			})

			const busyIdsSet = new Set(busyIds.map(id => String(id)))
			console.log("busyIdSet", busyIdsSet)
			const availableBoys = nearByDeliveryBoys.filter((b) => !busyIdsSet.has(String(b._id)));
			const candidates = availableBoys.map(b => b._id);

			if (candidates.length === 0) {
				return errorResponse(res, "not any delivery boys available")
			}

			const deliveryAssignment = await DeliveryAssignment.create({
				order: updatedOrder._id,
				shop: shopOrder.shop,
				shopOrderId: shopOrder._id,
				brodcastedTo: candidates,
				status: "brodcasted"
			})
			shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
			shopOrder.assignment = deliveryAssignment._id
			deliveryBoysPayload = availableBoys?.map(b => ({
				id: b._id,
				fullname: b.fullname,
				longitude: b.location.coordinates?.[0],
				latitude: b.location.coordinates?.[0],
				mobile: b.mobile
			}))
		}

		console.log("payload", deliveryBoysPayload)

		await updatedOrder.save()

		const updatedShopOrder = updatedOrder.shopOrder?.find(o => {
			const oShopId = o.shop?._id ? o.shop._id.toString() : o.shop.toString();
			return oShopId === shopId.toString();
		})

		if (!updatedShopOrder) {
			return errorResponse(res, "shop order not found after update")
		}

		successResponse(res, "order status updated successfully", {
			shopOrder: updatedShopOrder,
			assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
			availableBoys: deliveryBoysPayload,
			assignment: updatedShopOrder?.assignment?._id
		})
	} catch (error) {
		console.log(error.message)
		serverResponse(res, error, "update order error")
	}
}

exports.getDeliveryBoyAssignment = async (req, res) => {
	try {
		const deliveryBoyId = req.userId;
		console.log("db id", deliveryBoyId)
		const assignment = await DeliveryAssignment.find({
			brodcastedTo: deliveryBoyId,
			status: "brodcasted"
		}).populate(["order", "shop"])

		console.log("asss", assignment)

		const formatted = assignment.map((a) => ({
			assignmentId: a._id,
			orderId: a.order._id,
			shopname: a.shop.name,
			deliveryAddress: a.order.deliveryAddress,
			items: a.order.shopOrder.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
			subTotal: a.order.shopOrder.find(so => so._id.equals(a.shopOrderId))?.subTotal
		}))
		successResponse(res, "success", formatted)
	} catch (error) {
		console.log(error.message)
		serverResponse(res, error, "get delivery boy assignment error")
	}
}

exports.acceptOrder = async (req, res) => {
	try {
		const { assignmentId } = req.params;
		const assignment = await DeliveryAssignment.findById(assignmentId);
		if (!assignment) {
			return errorResponse(res, "assignment not found")
		}
		if (assignment.status !== "brodcasted") {
			return errorResponse(res, "'assignment is expired")
		}

		const alreadyAssigned = await DeliveryAssignment.findOne({
			assignedTo: req.userId,
			status: { $nin: ["brodcasted", "completed"] }
		})

		if (alreadyAssigned) {
			return errorResponse(res, "You are already assigned to other order")
		}

		assignment.assignedTo = req.userId;
		assignment.status = "assigned";
		assignment.acceptedAt = new Date();
		await assignment.save();

		const order = await Order.findById(assignment.order)
		if (!order) {
			return errorResponse(res, "order not found")
		}

		const shopOrder = order.shopOrder.id(assignment.shopOrderId)
		console.log("shhhOrder", shopOrder)
		shopOrder.assignedDeliveryBoy = req.userId;
		await order.save()

		successResponse(res, "Order Accepted")
	} catch (error) {
		console.log(error.message)
		serverResponse(res, error, "accept order error")
	}
}

exports.getCurrentOrder = async (req, res) => {
	try {
		const assignment = await DeliveryAssignment.findOne({
			assignedTo: req.userId,
			status: 'assigned'
		}).populate("shop", "name")
			.populate("assignedTo", "fullname email mobile location")
			.populate({
				path: "order",
				populate: [{ path: "user", select: "fullname email location mobile" },
				{
					path: "shopOrder.shop",
					select: "name"
				}
				]
			})

		if (!assignment) {
			return errorResponse(res, "assignment not found")
		}

		if (!assignment.order) {
			return errorResponse(res, "order not found")
		}

		const shopOrder = assignment.order.shopOrder.find(so => String(so._id) == String(assignment.shopOrderId))

		if (!shopOrder) {
			return errorResponse(res, "shop order not found")
		}

		let deliveryBoyLocation = { lat: null, lon: null }

		if (assignment.assignedTo.location.coordinates.length == 2) {
			deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
			deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
		}

		let customerLocation = { lat: null, lon: null };

		if (assignment.order.deliveryAddress) {
			customerLocation.lat = assignment.order.deliveryAddress.lattitude;
			customerLocation.lon = assignment.order.deliveryAddress.longitude;
		}

		const payload = {
			_id: assignment.order._id,
			user: assignment.order.user,
			shopOrder,
			deliveryAddress: assignment.order.deliveryAddress,
			deliveryBoyLocation,
			customerLocation
		}

		successResponse(res, "success", payload)

	} catch (error) {
		console.log(error.message)
		serverResponse(res, error, "accept order error")
	}
}