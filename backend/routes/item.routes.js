const itemRouter = require("express").Router();
const { createItem, updateItem } = require("../controllers/item.controller");
const { isAuth } = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

itemRouter.post("/create", isAuth, upload.single("image"), createItem)
itemRouter.put("/update/:id", isAuth, upload.single("image"), updateItem);

module.exports = itemRouter;