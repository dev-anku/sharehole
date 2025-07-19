#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Item = require("./models/item.js");

const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createItem(index, name, content) {
  const itemDetail = { type: "text", name: name, content: content };

  const item = new Item(itemDetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    createItem(0, "Text 1", "This is content for Text 1"),
    createItem(1, "Text 2", "This is content for Text 2"),
    createItem(2, "Text 3", "This is content for Text 3"),
    createItem(3, "Text 4", "This is content for Text 4"),
    createItem(4, "Text 5", "This is content for Text 5"),
  ]);
}
