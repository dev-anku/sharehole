const express = require("express");
const router = express.Router();
const upload = require("../config/multer.js");
const auth = require("../middleware/auth.js");

const itemController = require("../controllers/itemController.js");

router.get("/", auth, itemController.uploaded_items);
router.post("/text", auth, itemController.text_uploader);
router.post("/file", auth, upload.single("file"), itemController.file_uploader);
router.delete("/delete/:id", auth, itemController.item_delete);

module.exports = router;
