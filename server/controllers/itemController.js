const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Item = require("../models/item.js");

exports.uploaded_items = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ user: req.session.userId }).sort({
    uploadedAt: -1,
  });
  res.status(200).json(items);
});

exports.text_uploader = asyncHandler(async (req, res, next) => {
  const { name, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Text content is required." });
  }

  const newItem = new Item({
    type: "text",
    name,
    content,
    user: req.session.userId,
  });

  await newItem.save();
  res
    .status(201)
    .json({ message: "Text uploaded successfully!", item: newItem });
});

exports.file_uploader = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const newItem = new Item({
    type: "file",
    name,
    user: req.session.userId,
    fileName: req.file.originalname,
    filePath: req.file.path,
  });

  await newItem.save();
  res
    .status(201)
    .json({ message: "File uploaded successfully!", item: newItem });
});

exports.item_delete = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  if (item.type === "file") {
    fs.unlink(item.filePath, (err) => {
      if (err) console.error("Error deleting file: ", err);
    });
  }

  await item.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Item deleted successfully." });
});
