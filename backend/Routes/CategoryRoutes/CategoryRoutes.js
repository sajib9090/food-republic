const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getCategory(req, res, CategoryCollection) {
  try {
    const { categoryName } = req.query;

    if (categoryName) {
      // Use a regular expression for a case-insensitive partial search
      const regex = new RegExp(categoryName, "i");

      // Find categories where the category name contains the provided value
      const categories = await CategoryCollection.find({
        category: { $regex: regex },
      }).toArray();

      if (!categories || categories.length === 0) {
        return res.status(404).send("No matching categories found");
      }

      res.json({
        categories,
      });
    } else {
      // If categoryName is not provided, fetch all categories
      const allCategories = await CategoryCollection.find({}).toArray();

      res.json({
        categories: allCategories,
      });
    }
  } catch (error) {
    console.error("Database Fetching Error:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function addCategory(req, res, CategoryCollection) {
  const { category } = req.body;

  // Validate if category is a string
  if (typeof category !== "string") {
    return res.status(400).send("Category must be string");
  }

  const formattedItemName = category.replace(/\s+/g, "-").toLowerCase();

  try {
    // Check if a document with the same generic name already exists
    const existingItem = await CategoryCollection.findOne({
      category: formattedItemName,
    });

    if (existingItem) {
      // If a document with the same name exists, return an error response
      return res.status(400).send("Category name already exists");
    }

    // If no duplicate exists, insert the new document
    const newItem = {
      category: formattedItemName,
      createdDate: new Date(),
    };

    const result = await CategoryCollection.insertOne(newItem);
    res.json({
      message: "Item added successfully",
      result,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

// Export the router for use in other files
module.exports = { getCategory, addCategory };
