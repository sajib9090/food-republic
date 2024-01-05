const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();
const port = process.env.PORT || 8000;

//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    ///
    const MenuItemsCollection = client
      .db("FoodRepublic")
      .collection("menu-items");
    const CategoryCollection = client.db("FoodRepublic").collection("category");
    const usersCollection = client.db("FoodRepublic").collection("users");
    const tableCollection = client.db("FoodRepublic").collection("tables");
    const SoldItemsCollection = client
      .db("FoodRepublic")
      .collection("sold-invoices");
    const VoidInvoicesCollection = client
      .db("FoodRepublic")
      .collection("void-invoices");
    const ExpensesCollection = client.db("FoodRepublic").collection("expenses");

    const MemberCollection = client.db("FoodRepublic").collection("members");
    const StaffCollection = client.db("FoodRepublic").collection("staff");
    const OrderCollection = client
      .db("FoodRepublic")
      .collection("orderCollection");

    // API endpoint to get the list of tables from the collection

    app.get("/api/get-categories", async (req, res) => {
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
    });
    app.post("/api/add-category", async (req, res) => {
      const { category } = req.body;
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
    });

    app.get("/api/get-orders", async (req, res) => {
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
    });

    app.post("/api/add-order-staff", async (req, res) => {
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
    });

    app.delete("/api/delete-order", async (req, res) => {
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
    });
    // ObjectId

    app.get("/api/get-menu-items", async (req, res) => {
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
    });
    app.patch("/api/edit-menu-item/:itemId", async (req, res) => {
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
    });

    app.post("/api/add-menu-item", async (req, res) => {
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
    });

    app.delete("/api/delete-menu-item/:itemId", async (req, res) => {
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
    });

    //user
    app.get("/api/get-users", async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
      } catch (error) {
        res.status(500).send("Error fetching user data from the database");
      }
    });
    app.patch("/api/update-user/:id", async (req, res) => {
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
    });
    app.post("/api/add-user", async (req, res) => {
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
    });
    app.get("/api/tables", async (req, res) => {
      try {
        const tables = await tableCollection.find({}).toArray();
        res.json({ tables });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.patch("/api/table/:id", async (req, res) => {
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
    });
    // API endpoint to add a new table to the collection
    app.post("/api/add-table", async (req, res) => {
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
    });
    app.delete("/api/delete-table/:name", async (req, res) => {
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
    });

    //sold invoice api
    // this api can serve data by the help of id, date, start & end date, item name and month

    app.get("/api/get-sold-invoices", async (req, res) => {
      const invoiceId = req.query.id;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const date = req.query.date;
      const itemName = req.query.itemName;
      const month = req.query.month;
      const frId = req.query.frId; // New query parameter for fr_id

      try {
        let query = {};

        if (invoiceId) {
          // If ID parameter is provided, search for void invoice by ID
          const result = await SoldItemsCollection.findOne({
            _id: new ObjectId(invoiceId),
          });

          if (!result) {
            return res.status(404).json({ message: "Invoice not found" });
          }

          return res.json({
            message: "Sold invoice retrieved successfully",
            soldInvoice: result,
          });
        } else if (date) {
          // If date is provided, filter by that specific date
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfDay, $lte: endOfDay } };
        } else if (startDate && endDate) {
          // If both startDate and endDate are provided, filter by date range
          const startOfDay = new Date(startDate);
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfDay, $lte: endOfDay } };
        } else if (month) {
          // If month is provided, filter by that specific month
          const startOfMonth = new Date(month);
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const endOfMonth = new Date(month);
          endOfMonth.setMonth(endOfMonth.getMonth() + 1);
          endOfMonth.setDate(0);
          endOfMonth.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfMonth, $lte: endOfMonth } };
        } else if (frId) {
          // If frId is provided, filter by fr_id
          query = { fr_id: parseInt(frId) }; // Assuming fr_id is stored as an integer
        }

        if (itemName) {
          // If itemName is provided, add it to the query to filter by item name
          query["items"] = { $elemMatch: { item_name: itemName } };
        }

        const soldInvoices = await SoldItemsCollection.find(query).toArray();

        return res.json({
          message: "Sold invoices retrieved successfully",
          soldInvoices,
        });
      } catch (error) {
        console.error("Database Retrieval Error:", error);
        res
          .status(500)
          .send("Error retrieving sold invoices from the database");
      }
    });

    app.get("/api/get-sold-invoices-by-month-details", async (req, res) => {
      const month = req.query.month;

      try {
        if (!month) {
          return res
            .status(400)
            .json({ message: "Month parameter is required" });
        }

        const startOfMonth = new Date(month);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(month);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const query = { createdDate: { $gte: startOfMonth, $lte: endOfMonth } };

        // Calculate total_bill and total_discount for each day in the specified month
        const aggregatePipeline = [
          { $match: query },
          {
            $group: {
              _id: { $dayOfMonth: "$createdDate" },
              total_bill: { $sum: "$total_bill" },
              total_discount: { $sum: "$total_discount" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ];

        const dailyTotals = await SoldItemsCollection.aggregate(
          aggregatePipeline
        ).toArray();

        // Find the date with the highest total_bill
        let maxTotal = 0;
        let maxTotalDate;

        // Find the date with the lowest total_bill
        let minTotal = Infinity;
        let minTotalDate;

        dailyTotals.forEach((dailyTotal) => {
          if (dailyTotal.total_bill > maxTotal) {
            maxTotal = dailyTotal.total_bill;
            maxTotalDate = dailyTotal._id;
          }

          if (dailyTotal.total_bill < minTotal) {
            minTotal = dailyTotal.total_bill;
            minTotalDate = dailyTotal._id;
          }
        });

        return res.json({
          message: "Sold invoices by month retrieved successfully",
          dailyTotals,
          maxTotalDate,
          maxTotal,
          minTotalDate,
          minTotal,
        });
      } catch (error) {
        console.error("Database Retrieval Error:", error);
        res
          .status(500)
          .send("Error retrieving sold invoices by month from the database");
      }
    });

    app.patch(
      "/api/patch-sold-invoices-update-item-quantity",
      async (req, res) => {
        const { invoiceId, itemId, newQuantity } = req.body;

        try {
          const objectId = new ObjectId(invoiceId);
          const soldInvoice = await SoldItemsCollection.findOne({
            _id: objectId,
          });

          if (!soldInvoice) {
            return res.status(404).json({
              message: "Sold invoice not found",
            });
          }

          const updatedItems = soldInvoice.items.map((item) => {
            if (item._id.toString() === itemId) {
              return {
                ...item,
                item_quantity: newQuantity,
                void: true,
              };
            }
            return item;
          });

          const updatedInvoice = await SoldItemsCollection.findOneAndUpdate(
            { _id: objectId },
            { $set: { items: updatedItems } },
            { returnDocument: "after" }
          );

          return res.json({
            message: "Item quantity updated successfully",
            updatedInvoice,
          });
        } catch (error) {
          console.error("Database Update Error:", error);
          res.status(500).send("Error updating item quantity in the database");
        }
      }
    );

    // app.post("/api/post-sold-invoices", async (req, res) => {
    //   const { table_name, served_by, items, total_bill, total_discount } =
    //     req.body;
    //   const createdDate = new Date();

    //   try {
    //     // Calculate the total price for each item
    //     const itemsWithTotalPrice = items.map((item) => ({
    //       ...item,
    //       total_price: item.item_price_per_unit * item.item_quantity,
    //     }));

    //     // Insert the new document
    //     const result = await SoldItemsCollection.insertOne({
    //       table_name,
    //       served_by,
    //       items: itemsWithTotalPrice,
    //       total_bill,
    //       total_discount,
    //       createdDate,
    //     });

    //     res.json({
    //       message: "Data added successfully",
    //       insertedId: result.insertedId,
    //     });
    //   } catch (error) {
    //     console.error("Database Insertion Error:", error);
    //     res.status(500).send("Error inserting data into the database");
    //   }
    // });

    app.post("/api/post-sold-invoices", async (req, res) => {
      const {
        table_name,
        served_by,
        items,
        total_bill,
        total_discount,
        member,
      } = req.body;
      const createdDate = new Date();

      try {
        // Fetch the latest fr_id from the database
        const latestSoldInvoice = await SoldItemsCollection.findOne(
          {},
          { sort: { fr_id: -1 } }
        );
        const latestFrId = latestSoldInvoice ? latestSoldInvoice.fr_id : 0;

        // Calculate the total price for each item
        const itemsWithTotalPrice = items.map((item) => ({
          ...item,
          total_price: item.item_price_per_unit * item.item_quantity,
        }));

        // Insert the new document with an incremented fr_id
        const result = await SoldItemsCollection.insertOne({
          fr_id: latestFrId + 1,
          member,
          table_name,
          served_by,
          items: itemsWithTotalPrice,
          total_bill,
          total_discount,
          createdDate,
        });

        res.json({
          message: "Data added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting data into the database");
      }
    });

    // app.delete("/api/delete-sold-invoice", async (req, res) => {
    //   const { _id } = req.query;

    //   try {
    //     if (!_id) {
    //       return res
    //         .status(400)
    //         .json({ message: "_id is required for deletion" });
    //     }

    //     // Convert the string _id to ObjectId
    //     const objectId = new ObjectId(_id);

    //     // Delete the document based on _id
    //     const result = await SoldItemsCollection.deleteOne({ _id: objectId });

    //     if (result.deletedCount === 0) {
    //       return res
    //         .status(404)
    //         .json({ message: "No document found for the specified _id" });
    //     }

    //     res.json({
    //       message: `Successfully deleted document with _id: ${_id}`,
    //     });
    //   } catch (error) {
    //     console.error("Database Deletion Error:", error);
    //     res.status(500).send("Error deleting data from the database");
    //   }
    // });

    //this api can serve data by the help of id, date, start date, end date, sold-invoice_id and also table_name
    app.get("/api/get-void-invoices", async (req, res) => {
      try {
        // Check if an ID, date, start date, end date, sold_invoice_id, or table_name parameter is provided
        const { id, date, startDate, endDate, sold_invoice_id, table_name } =
          req.query;

        if (id) {
          // If ID parameter is provided, search for void invoice by ID
          const result = await VoidInvoicesCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!result) {
            return res.status(404).json({
              message: `Void invoice with ID ${id} not found`,
              voidInvoices: [],
            });
          }

          res.json({
            message: `Void invoice with ID ${id} fetched successfully`,
            voidInvoices: [result],
          });
        } else if (date) {
          // If date parameter is provided, search for void invoices by date
          const result = await VoidInvoicesCollection.find({
            createdAt: {
              $gte: new Date(`${date}T00:00:00.000Z`),
              $lt: new Date(`${date}T23:59:59.999Z`),
            },
          }).toArray();

          res.json({
            message: `Void invoices for date ${date} fetched successfully`,
            voidInvoices: result,
          });
        } else if (startDate && endDate) {
          // If start date and end date parameters are provided, search for void invoices within the date range
          const result = await VoidInvoicesCollection.find({
            createdAt: {
              $gte: new Date(`${startDate}T00:00:00.000Z`),
              $lt: new Date(`${endDate}T23:59:59.999Z`),
            },
          }).toArray();

          res.json({
            message: `Void invoices between ${startDate} and ${endDate} fetched successfully`,
            voidInvoices: result,
          });
        } else if (sold_invoice_id) {
          // If sold_invoice_id parameter is provided, search for void invoices by sold_invoice_id
          const result = await VoidInvoicesCollection.find({
            sold_invoice_id: sold_invoice_id,
          }).toArray();

          res.json({
            message: `Void invoices for sold_invoice_id ${sold_invoice_id} fetched successfully`,
            voidInvoices: result,
          });
        } else if (table_name) {
          // If table_name parameter is provided, search for void invoices by table_name
          const result = await VoidInvoicesCollection.find({
            "item.table_name": table_name,
          }).toArray();

          res.json({
            message: `Void invoices for table_name ${table_name} fetched successfully`,
            voidInvoices: result,
          });
        } else {
          // If no ID, date, start date, end date, sold_invoice_id, or table_name parameter is provided, fetch all void invoices
          const result = await VoidInvoicesCollection.find({}).toArray();

          res.json({
            message: "All void invoices fetched successfully",
            voidInvoices: result,
          });
        }
      } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send("Error fetching void invoices from the database");
      }
    });

    //
    app.post("/api/post-void-invoice", async (req, res) => {
      const {
        sold_invoice_id,
        table_name,
        item,
        previous_quantity,
        void_quantity,
      } = req.body;
      const createdAt = new Date();

      try {
        // Insert the new void invoice document
        const result = await VoidInvoicesCollection.insertOne({
          sold_invoice_id,
          table_name,
          item,
          previous_quantity,
          void_quantity,
          createdAt,
        });

        res.json({
          message: "Void invoice added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting void invoice into the database");
      }
    });
    //expense api
    app.get("/api/get-expenses", async (req, res) => {
      try {
        // Check if date and month parameters are provided in the query
        const { date, month, sortByTitle } = req.query;

        let query = {};

        // If date parameter is provided, add it to the query
        if (date) {
          query.createdDate = {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          };
        } else if (month) {
          // If month parameter is provided, add it to the query
          const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
          const endOfMonth = new Date(
            new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1
          );

          query.createdDate = {
            $gte: startOfMonth,
            $lt: endOfMonth,
          };
        }

        let expenses;

        // If sortByTitle is provided, sort the expenses by title
        if (sortByTitle) {
          expenses = await ExpensesCollection.find(query)
            .sort({ title: 1 })
            .toArray();
        } else {
          // If no date or month parameter is provided, retrieve all expenses
          expenses = await ExpensesCollection.find(query).toArray();
        }

        res.json({
          message: `Expenses retrieved successfully`,
          expenses,
        });
      } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send("Error fetching expenses from the database");
      }
    });

    app.get("/api/get-expenses-by-month", async (req, res) => {
      try {
        // Check if date, month, and sortByTitle parameters are provided in the query
        const { month } = req.query;

        let query = {};

        if (month) {
          // If month parameter is provided, add it to the query
          const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
          const endOfMonth = new Date(
            new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1
          );

          query.createdDate = {
            $gte: startOfMonth,
            $lt: endOfMonth,
          };
        }

        let pipeline = [
          { $match: query },
          { $sort: { createdDate: 1 } }, // Sort by createdDate in ascending order
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdDate" },
              },
              expenses: { $push: "$$ROOT" },
              totalExpenses: { $sum: "$expense_price" }, // Use the correct field name here
            },
          },
          { $sort: { _id: 1 } }, // Sort the result by date in ascending order
        ];

        // Execute the aggregation pipeline
        let result = await ExpensesCollection.aggregate(pipeline).toArray();

        res.json({
          message: `Expenses retrieved successfully`,
          result,
        });
      } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send("Error fetching expenses from the database");
      }
    });

    app.post("/api/post-expense", async (req, res) => {
      const { title, expense_price, creator } = req.body;
      const createdDate = new Date();

      // Extract the part of the email before @ symbol
      const creatorPrefix = creator.split("@")[0];

      // Replace spaces in the title with hyphens and convert to lowercase
      const formattedTitle = title.replace(/\s+/g, "-").toLowerCase();

      try {
        // Insert the new expense without checking for duplicates
        const newExpense = {
          title: formattedTitle,
          createdDate,
          expense_price,
          creator: creatorPrefix,
        };

        const result = await ExpensesCollection.insertOne(newExpense);
        res.json({
          message: "Expense added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting data into the database");
      }
    });
    app.delete("/api/delete-expense", async (req, res) => {
      try {
        const expenseId = req.query.id;

        // Validate if the provided ID is a valid MongoDB ObjectId
        if (!ObjectId.isValid(expenseId)) {
          return res.status(400).json({ message: "Invalid expense ID" });
        }

        const result = await ExpensesCollection.deleteOne({
          _id: new ObjectId(expenseId),
        });

        if (result.deletedCount === 1) {
          res.json({ message: "Expense deleted successfully" });
        } else {
          res.status(404).json({ message: "Expense not found" });
        }
      } catch (error) {
        console.error("Database Delete Error:", error);
        res.status(500).send("Error deleting expense from the database");
      }
    });

    app.get("/api/get-members", async (req, res) => {
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
    });

    app.patch("/api/update-member/:mobile", async (req, res) => {
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
    });

    app.post("/api/add-member", async (req, res) => {
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
    });
    app.delete("/api/delete-member", async (req, res) => {
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
    });

    //staff api
    app.get("/api/get-all-staff", async (req, res) => {
      try {
        // Retrieve all staff data from the collection and sort alphabetically by the "name" field
        const allStaff = await StaffCollection.find()
          .sort({ name: 1 })
          .toArray();

        res.json({
          message:
            "All staff data retrieved and sorted alphabetically successfully",
          staffData: allStaff,
        });
      } catch (error) {
        console.error("Database Retrieval Error:", error);
        res.status(500).send("Error retrieving data from the database");
      }
    });

    app.post("/api/add-staff", async (req, res) => {
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
    });

    app.delete("/api/delete-staff/:id", async (req, res) => {
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
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Food republic server is running");
});
app.listen(port, () => {
  console.log(`Food republic Server is running on port, ${port}`);
});
