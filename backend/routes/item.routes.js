const itemRouter = require("express").Router();
const { createItem, updateItem, deleteItem, getItemById } = require("../controllers/item.controller");
const { isAuth } = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

itemRouter.post("/create", isAuth, upload.single("image"), createItem)
itemRouter.put("/update/:id", isAuth, upload.single("image"), updateItem);
itemRouter.delete("/delete-item/:id", isAuth, deleteItem)
itemRouter.get("/getItemById/:id", isAuth, getItemById)

module.exports = itemRouter;