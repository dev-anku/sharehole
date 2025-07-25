const asyncHandler = require("express-async-handler");
const path = require("path");
const cloudinary = require("../config/cloudinary.js");
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

function getResourceTypeFromMime(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw"; // for PDFs, zips, docs, etc.
}

exports.file_uploader = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const resourceType = getResourceTypeFromMime(req.file.mimetype);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const newItem = new Item({
    type: "file",
    name,
    user: req.session.userId,
    fileName: req.file.originalname,
    publicId: req.file.filename,
    resourceType,
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

  if (item.type === "file" && item.publicId) {
    try {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.resourceType,
      });
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
    }
  }

  await item.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Item deleted successfully." });
});
