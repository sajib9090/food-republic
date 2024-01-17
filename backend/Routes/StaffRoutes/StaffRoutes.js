const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getStaffs(req, res, StaffCollection) {
  try {
    // Retrieve all staff data from the collection and sort alphabetically by the "name" field
    const allStaff = await StaffCollection.find().sort({ name: 1 }).toArray();

    res.json({
      message:
        "All staff data retrieved and sorted alphabetically successfully",
      staffData: allStaff,
    });
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res.status(500).send("Error retrieving data from the database");
  }
}

async function addStaff(req, res, StaffCollection) {
  const { name } = req.body;

  const createdDate = new Date();

  try {
    // Check if a member with the same mobile number already exists
    const existingStaff = await StaffCollection.findOne({
      name: name.toLowerCase(),
    });

    if (existingStaff) {
      return res.status(400).json({
        message: "A staff with this name already exists.",
      });
    }

    // Insert member data into the collection
    const result = await StaffCollection.insertOne({
      name: name.toLowerCase(),
      createdDate,
    });

    res.json({
      message: "Staff added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

async function removeStaff(req, res, StaffCollection) {
  const staffId = req.params.id;

  try {
    // Validate if staffId is a valid ObjectId
    if (!ObjectId.isValid(staffId)) {
      return res.status(400).json({ message: "Invalid staff ID format" });
    }

    // Convert staffId to ObjectId
    const objectIdStaffId = new ObjectId(staffId);

    // Delete staff data from the collection based on the provided ID
    const deleteResult = await StaffCollection.deleteOne({
      _id: objectIdStaffId,
    });

    if (deleteResult.deletedCount === 1) {
      res.json({
        message: "Staff data deleted successfully",
      });
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  } catch (error) {
    console.error("Database Deletion Error:", error);
    res.status(500).send("Error deleting data from the database");
  }
}
module.exports = { getStaffs, addStaff, removeStaff };
