const Order = require("../modals/orderModal");
const Shop = require("../modals/shop.modal");
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
		const orderList = await Order.find({ user: userId }).populate(["shopOrder.shop", "shopOrder.owner"])
		if (!orderList || orderList.length <= 0) {
			return successResponse(res, "order list is empty")
		}
		const itemsByShops = orderList?.[0]?.shopOrder
		successResponse(res, "order fetched successfully", itemsByShops)
	} catch (error) {
		serverResponse(res, error, "get orders error")
	}
}