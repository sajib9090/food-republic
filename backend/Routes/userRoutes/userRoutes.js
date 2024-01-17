const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getUsers(req, res, usersCollection) {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching user data from the database");
  }
}

async function editUserById(req, res, usersCollection) {
  const userId = req.params.id;

  try {
    // Assuming req.body contains the updated user data
    const updatedUserData = req.body;

    // Validate and process the updated data as needed

    // Update the user in the database
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUserData }
    );

    if (result.modifiedCount > 0) {
      res.json({ success: true, message: "User updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user data");
  }
}

async function addUser(req, res, usersCollection) {
  const userData = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    // Insert the new user document
    const result = await usersCollection.insertOne(userData);
    res.send(result);
  } catch (error) {
    res.status(500).send("Error inserting user data into the database");
  }
}
module.exports = { getUsers, editUserById, addUser };
