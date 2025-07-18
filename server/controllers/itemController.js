const Item = require("../models/item.js");

exports.uploaded_items = async (req, res) => {
  try {
    const items = await Item.find().sort({ uploadedAt: -1 });
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
