const path = require("path");
const fs = require("fs");
const Item = require("../models/item.js");

exports.uploaded_items = async (req, res) => {
  try {
    const items = await Item.find({ user: req.session.userId }).sort({
      uploadedAt: -1,
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items: ", error);
    res.status(500).json({ message: "Server error fetching items." });
  }
};

exports.text_uploader = async (req, res) => {
  const { name, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Text content is required." });
  }

  try {
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
  } catch (error) {
    console.error("Error uploading text: ", error);
    res.status(500).json({ message: "Server error during text upload." });
  }
};

exports.file_uploader = async (req, res) => {
  const { name } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
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
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
};

exports.item_delete = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error deleting item: ", error);
    res.status(500).json({ message: "Server error deleting item." });
  }
};
