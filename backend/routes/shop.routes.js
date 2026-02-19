const shopRouter = require("express").Router();
const { createOrEditShop } = require("../controllers/shop.controllers");
const { isAuth } = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

shopRouter.post("/create-update", isAuth, upload.single("image"), createOrEditShop);

module.exports = shopRouter;