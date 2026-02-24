const shopRouter = require("express").Router();
const { createOrEditShop, getShops } = require("../controllers/shop.controllers");
const { isAuth } = require("../middlewares/isAuth.js");
const upload = require("../middlewares/multer");

shopRouter.post("/create-update", isAuth, upload.single("image"), createOrEditShop);
shopRouter.get("/getShops", isAuth, getShops)

module.exports = shopRouter;