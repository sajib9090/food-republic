const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getMenuItems(req, res, MenuItemsCollection) {
  try {
    const { itemId, itemName, category } = req.query;

    if (itemId) {
      // If itemId is provided, find the menu item by ID
      const menuItem = await MenuItemsCollection.findOne({
        _id: new ObjectId(itemId),
      });

      if (!menuItem) {
        return res.status(404).send("Menu item not found");
      }

      res.json({
        menuItem,
      });
    } else if (itemName) {
      // If itemName is provided, find menu items by partial match on item_name
      const regex = new RegExp(itemName, "i");
      const menuItems = await MenuItemsCollection.find({
        item_name: { $regex: regex },
      })
        .sort({ item_name: 1 })
        .toArray();

      if (!menuItems || menuItems.length === 0) {
        return res.status(404).send("No matching menu items found");
      }

      res.json({
        menuItems,
      });
    } else if (category) {
      // If category is provided, find menu items by partial match on category
      const regex = new RegExp(category, "i");
      const menuItems = await MenuItemsCollection.find({
        category: { $regex: regex },
      })
        .sort({ category: 1 })
        .toArray();

      if (!menuItems || menuItems.length === 0) {
        return res.status(404).send("No matching menu items found");
      }

      res.json({
        menuItems,
      });
    } else {
      // If neither itemId nor itemName nor category is provided, fetch all menu items and sort alphabetically
      const menuItems = await MenuItemsCollection.find({})
        .sort({ item_name: 1 })
        .toArray();

      res.json({
        menuItems,
      });
    }
  } catch (error) {
    console.error("Database Fetching Error:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function editMenuItem(req, res, MenuItemsCollection) {
  const { itemId } = req.params;
  const updatedData = req.body;

  try {
    // Validate if itemId is a valid ObjectId
    if (!ObjectId.isValid(itemId)) {
      return res.status(400).send("Invalid item ID");
    }

    // Check if the menu item exists
    const existingItem = await MenuItemsCollection.findOne({
      _id: new ObjectId(itemId),
    });

    if (!existingItem) {
      return res.status(404).send("Menu item not found");
    }

    // Update the menu item with the new data
    const result = await MenuItemsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $set: updatedData }
    );

    if (result.modifiedCount > 0) {
      // If at least one document was modified, return success
      return res.json({ message: "Menu item updated successfully" });
    } else {
      // If no document was modified, return a message indicating that
      return res.json({ message: "No changes made" });
    }
  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).send("Error updating data in the database");
  }
}

async function addMenuItem(req, res, MenuItemsCollection) {
  const { item_name, category, item_price, discount } = req.body;
  const formattedItemName = item_name.replace(/\s+/g, "-").toLowerCase();
  const formattedCategory = category.replace(/\s+/g, "-").toLowerCase(); // Format category name
  const createdDate = new Date();

  try {
    // Check if a document with the same generic name and category already exists
    const existingItem = await MenuItemsCollection.findOne({
      item_name: formattedItemName,
      category: formattedCategory,
    });

    if (existingItem) {
      // If a document with the same name and category exists, return an error response
      return res
        .status(400)
        .send("Item name already exists for the given category");
    }

    // If no duplicate exists, insert the new document
    const newItem = {
      item_name: formattedItemName,
      category: formattedCategory,
      item_price,
      createdDate,
      discount: true,
    };

    const result = await MenuItemsCollection.insertOne(newItem);
    res.json({
      message: "Item added successfully",
      result,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

async function removeMenuItem(req, res, MenuItemsCollection) {
  try {
    const { itemId } = req.params;
    // Validate if the provided itemId is a valid ObjectId
    if (!ObjectId.isValid(itemId)) {
      return res.status(400).send("Invalid itemId format");
    }
    // Attempt to delete the menu item
    const deleteResult = await MenuItemsCollection.deleteOne({
      _id: new ObjectId(itemId),
    });
    // Check if the menu item was found and deleted
    if (deleteResult.deletedCount === 0) {
      return res.status(404).send("Menu item not found");
    }

    res.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Database Deletion Error:", error);
    res.status(500).send("Error deleting data from the database");
  }
}

module.exports = { getMenuItems, editMenuItem, addMenuItem, removeMenuItem };
