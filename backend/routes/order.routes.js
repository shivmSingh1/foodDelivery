const { placeOrder, getOrders, getOwnerOrder, updateOrderStatus, getDeliveryBoyAssignment, acceptOrder, getCurrentOrder } = require("../controllers/order.controllers");
const { isAuth } = require("../middlewares/isAuth");

const orderRouter = require("express").Router()

orderRouter.post("/placeOrder", isAuth, placeOrder)
orderRouter.get("/getOrders", isAuth, getOrders)
orderRouter.get('/getOwnerOrder', isAuth, getOwnerOrder)
orderRouter.post('/updateOrderStatus', isAuth, updateOrderStatus)
orderRouter.get('/get-assignment', isAuth, getDeliveryBoyAssignment)
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder)
orderRouter.get('/getCurrentOrder', isAuth, getCurrentOrder)

module.exports = orderRouter;