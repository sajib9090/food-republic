const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getOrders(req, res, OrderCollection) {
  try {
    const { id, table_code } = req.query;
    let query = {};

    if (id) {
      // If ID is provided, find a specific order by ID
      query._id = new ObjectId(id);
    }

    if (table_code) {
      // If table_code is provided, filter by table_code
      query.table_code = table_code;
    }

    const orders = await OrderCollection.find(query).toArray();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res.status(500).send("Error retrieving data from the database");
  }
}

async function addOrders(req, res, OrderCollection) {
  const { staff_name, table_code } = req.body;

  try {
    const newItem = {
      staff_name,
      table_code,
      createdDate: new Date(),
    };

    const result = await OrderCollection.insertOne(newItem);
    res.json({
      message: "Item added successfully",
      result,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

async function removeOrders(req, res, OrderCollection) {
  try {
    const { table_code } = req.query;

    if (!table_code) {
      return res
        .status(400)
        .json({ message: "Table code is required for deletion" });
    }

    const result = await OrderCollection.deleteMany({ table_code });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified table_code" });
    }

    res.json({
      message: `Successfully deleted ${result.deletedCount} order(s) with table_code: ${table_code}`,
    });
  } catch (error) {
    console.error("Database Deletion Error:", error);
    res.status(500).send("Error deleting data from the database");
  }
}

module.exports = { getOrders, addOrders, removeOrders };
