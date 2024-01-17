const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getMembers(req, res, MemberCollection) {
  try {
    const searchQuery = req.query.search;

    if (searchQuery) {
      // Find a member by mobile number or name
      const member = await MemberCollection.findOne({
        $or: [
          { mobile: searchQuery },
          { name: { $regex: new RegExp(searchQuery, "i") } }, // Case-insensitive search by name
        ],
      });

      if (!member) {
        return res.status(404).json({
          message: "Member not found",
        });
      }

      res.json({
        message: "Member retrieved successfully",
        member: member,
      });
    } else {
      // Retrieve all member data from the collection
      const allMembers = await MemberCollection.find().toArray();

      res.json({
        message: "Members retrieved successfully",
        members: allMembers,
      });
    }
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res.status(500).send("Error retrieving data from the database");
  }
}

async function editMemberByMobile(req, res, MemberCollection) {
  try {
    const mobileNumber = req.params.mobile;
    const updatedFields = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        message: "Mobile number is required in the URL parameter",
      });
    }

    // Find the member by mobile number
    const member = await MemberCollection.findOne({ mobile: mobileNumber });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Update member fields
    const currentTotalDiscount = member.total_discount || 0; // If total_discount is undefined, assume 0
    const newTotalDiscount = updatedFields.total_discount || 0; // If total_discount is not provided in the request body, assume 0
    updatedFields.total_discount = currentTotalDiscount + newTotalDiscount;

    const currentTotalSpent = member.total_spent || 0;
    const newTotalSpent = updatedFields.total_spent || 0;
    updatedFields.total_spent = currentTotalSpent + newTotalSpent;

    // Append new invoices_code values to the existing array or create a new array
    updatedFields.invoices_code = [
      ...(member.invoices_code || []), // Previous values
      ...(Array.isArray(updatedFields.invoices_code)
        ? updatedFields.invoices_code
        : [updatedFields.invoices_code]), // New values
    ];

    const updatedMember = await MemberCollection.findOneAndUpdate(
      { mobile: mobileNumber },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    res.json({
      message: "Member updated successfully",
      member: updatedMember.value,
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).send("Error updating data in the database");
  }
}

async function addMember(req, res, MemberCollection) {
  const { name, mobile } = req.body;
  const discountValue = 10; // Set the default discount value to 15
  const createdDate = new Date(); // Get the current date and time

  try {
    // Check if a member with the same mobile number already exists
    const existingMember = await MemberCollection.findOne({ mobile });

    if (existingMember) {
      return res.status(400).json({
        message: "A member with this mobile number already exists.",
      });
    }

    // Insert member data into the collection
    const result = await MemberCollection.insertOne({
      name,
      mobile,
      discountValue,
      createdDate,
    });

    res.json({
      message: "Member added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

async function removeMember(req, res, MemberCollection) {
  try {
    const mobile = req.query.mobile;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    // Find and delete a member by mobile number
    const result = await MemberCollection.deleteOne({ mobile: mobile });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({
      message: "Member deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Database Deletion Error:", error);
    res.status(500).send("Error deleting data from the database");
  }
}

module.exports = { getMembers, editMemberByMobile, addMember, removeMember };
