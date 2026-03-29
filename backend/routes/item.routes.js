const itemRouter = require("express").Router();
const { createItem, updateItem, deleteItem, getItemById, getItemsByCity, getItemsByShop, searchItems } = require("../controllers/item.controller");
const { isAuth } = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

itemRouter.post("/create", isAuth, upload.single("image"), createItem)
itemRouter.put("/update/:id", isAuth, upload.single("image"), updateItem);
itemRouter.delete("/delete-item/:id", isAuth, deleteItem)
itemRouter.get("/getItemById/:id", isAuth, getItemById)
itemRouter.get("/getItemsbyCity", isAuth, getItemsByCity)
itemRouter.get("/items/:shopId", isAuth, getItemsByShop);
itemRouter.get("/search-item", isAuth, searchItems);

module.exports = itemRouter;