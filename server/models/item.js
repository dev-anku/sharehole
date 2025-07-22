const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  type: { type: String, required: true, enum: ["text", "file"] },
  name: { type: String, required: true }, 
  content: { type: String, required: function() { return this.type === "text"; } },
  fileName: { type: String, required: function() { return this.type === "file"; } }, 
  filePath: { type: String, required: function() { return this.type === "file"; } }, 
  uploadedAt: { type: Date, default: Date.now },
});

ItemSchema.virtual("url").get(function() {
  return `/items/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
