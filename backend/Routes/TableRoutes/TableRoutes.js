const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getTables(req, res, tableCollection) {
  try {
    const tables = await tableCollection.find({}).toArray();
    res.json({ tables });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function editTableById(req, res, tableCollection) {
  try {
    const tableId = req.params.id;
    const updatedData = req.body; // Assuming you send the updated data in the request body

    // Validate or sanitize the updated data if needed

    // Perform the update operation in the MongoDB collection
    const result = await tableCollection.updateOne(
      { _id: new ObjectId(tableId) },
      { $set: updatedData }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: "Data updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Table not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addTable(req, res, tableCollection) {
  try {
    const currentDate = new Date();
    const newTable = await tableCollection.insertOne({
      name: `table-${(await tableCollection.countDocuments()) + 1}`,
      createdAt: currentDate,
    });
    res.json({ message: "Table added successfully", newTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function removeTableByName(req, res, tableCollection) {
  try {
    const tableName = req.params.name;

    // Use MongoDB's deleteOne to remove the table by its name
    const result = await tableCollection.deleteOne({ name: tableName });

    // Check if the table was found and deleted
    if (result.deletedCount === 1) {
      return res.json({ message: "Table deleted successfully" });
    } else {
      return res.status(404).json({ error: "Table not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getTables,
  editTableById,
  addTable,
  removeTableByName,
};
