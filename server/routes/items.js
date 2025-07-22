const express = require("express");
const router = express.Router();
const upload = require("../config/multer.js");

const itemController = require("../controllers/itemController.js");

router.get("/", itemController.uploaded_items);
router.post("/text", itemController.text_uploader);
router.post("/file", upload.single("file"), itemController.file_uploader);
router.get("/delete/:id", itemController.item_delete_get);
router.post("/delete/:id", itemController.item_delete_post);

module.exports = router;
