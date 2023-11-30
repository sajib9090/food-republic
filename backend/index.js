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
    const usersCollection = client.db("FoodRepublic").collection("users");
    const tableCollection = client.db("FoodRepublic").collection("tables");
    const DrinksAndJuiceCollection = client
      .db("FoodRepublic")
      .collection("drinks-juice");
    const FastFoodCollection = client
      .db("FoodRepublic")
      .collection("fast-food");
    const VegetablesAndRicesCollection = client
      .db("FoodRepublic")
      .collection("vegetables-rices");
    const SoldItemsCollection = client
      .db("FoodRepublic")
      .collection("sold-invoices");
    const VoidInvoicesCollection = client
      .db("FoodRepublic")
      .collection("void-invoices");
    const ExpensesCollection = client.db("FoodRepublic").collection("expenses");

    // API endpoint to get the list of tables from the collection
    //user
    app.get("/api/get-users", async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
      } catch (error) {
        res.status(500).send("Error fetching user data from the database");
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

    //drinks and juice api
    app.get("/api/get-drinks-juices", async (req, res) => {
      try {
        // Fetch the sorted list of items alphabetically
        const sortedItems = await DrinksAndJuiceCollection.find({})
          .sort({ item_name: 1 })
          .toArray();

        res.json({
          message: "Items retrieved successfully",
          items: sortedItems,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/api/add-drinks-juices", async (req, res) => {
      const { item_name, item_price } = req.body;
      const formattedItemName = item_name.replace(/\s+/g, "-").toLowerCase();
      const createdDate = new Date();

      try {
        // Check if a document with the same generic name already exists
        const existingItem = await DrinksAndJuiceCollection.findOne({
          item_name: formattedItemName,
        });

        if (existingItem) {
          // If a document with the same name exists, return an error response
          return res.status(400).send("Item name already exists");
        }

        // If no duplicate exists, insert the new document
        const newItem = {
          item_name: formattedItemName,
          item_price,
          createdDate,
        };

        const result = await DrinksAndJuiceCollection.insertOne(newItem);
        res.json({
          message: "Item added successfully",
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting data into the database");
      }
    });
    app.delete("/api/delete-drinks-juices/:id", async (req, res) => {
      try {
        const itemId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(itemId)) {
          return res.status(400).json({ error: "Invalid Item ID" });
        }

        // Use MongoDB's deleteOne to remove the fast food item by its ID
        const result = await DrinksAndJuiceCollection.deleteOne({
          _id: new ObjectId(itemId),
        });

        // Check if the item was found and deleted
        if (result.deletedCount === 1) {
          return res.json({ message: "Fast food item deleted successfully" });
        } else {
          return res.status(404).json({ error: "Fast food item not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    // fast food api
    app.get("/api/get-fast-food", async (req, res) => {
      try {
        // Fetch the sorted list of items alphabetically
        const sortedItems = await FastFoodCollection.find({})
          .sort({ item_name: 1 })
          .toArray();

        res.json({
          message: "Items retrieved successfully",
          items: sortedItems,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.post("/api/add-fast-food", async (req, res) => {
      const { item_name, item_price } = req.body;
      const formattedItemName = item_name.replace(/\s+/g, "-").toLowerCase();
      const createdDate = new Date();

      try {
        // Check if a document with the same generic name already exists
        const existingItem = await FastFoodCollection.findOne({
          item_name: formattedItemName,
        });

        if (existingItem) {
          // If a document with the same name exists, return an error response
          return res.status(400).send("Item name already exists");
        }

        // If no duplicate exists, insert the new document
        const newItem = {
          item_name: formattedItemName,
          item_price,
          createdDate,
        };

        const result = await FastFoodCollection.insertOne(newItem);
        res.json({
          message: "Item added successfully",
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting data into the database");
      }
    });

    app.delete("/api/delete-fast-food/:id", async (req, res) => {
      try {
        const itemId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(itemId)) {
          return res.status(400).json({ error: "Invalid Item ID" });
        }

        // Use MongoDB's deleteOne to remove the fast food item by its ID
        const result = await FastFoodCollection.deleteOne({
          _id: new ObjectId(itemId),
        });

        // Check if the item was found and deleted
        if (result.deletedCount === 1) {
          return res.json({ message: "Fast food item deleted successfully" });
        } else {
          return res.status(404).json({ error: "Fast food item not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // vegetables and rice api
    app.get("/api/get-vegetables-rices", async (req, res) => {
      try {
        // Fetch the sorted list of items alphabetically
        const sortedItems = await VegetablesAndRicesCollection.find({})
          .sort({ item_name: 1 })
          .toArray();

        res.json({
          message: "Items retrieved successfully",
          items: sortedItems,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.post("/api/add-vegetables-rices", async (req, res) => {
      const { item_name, item_price } = req.body;
      const formattedItemName = item_name.replace(/\s+/g, "-").toLowerCase();
      const createdDate = new Date();

      try {
        // Check if a document with the same generic name already exists
        const existingItem = await VegetablesAndRicesCollection.findOne({
          item_name: formattedItemName,
        });

        if (existingItem) {
          // If a document with the same name exists, return an error response
          return res.status(400).send("Item name already exists");
        }

        // If no duplicate exists, insert the new document
        const newItem = {
          item_name: formattedItemName,
          item_price,
          createdDate,
        };

        const result = await VegetablesAndRicesCollection.insertOne(newItem);
        res.json({
          message: "Item added successfully",
        });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).send("Error inserting data into the database");
      }
    });
    app.delete("/api/delete-vegetables-rices/:id", async (req, res) => {
      try {
        const itemId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(itemId)) {
          return res.status(400).json({ error: "Invalid Item ID" });
        }

        // Use MongoDB's deleteOne to remove the fast food item by its ID
        const result = await VegetablesAndRicesCollection.deleteOne({
          _id: new ObjectId(itemId),
        });

        // Check if the item was found and deleted
        if (result.deletedCount === 1) {
          return res.json({ message: "Fast food item deleted successfully" });
        } else {
          return res.status(404).json({ error: "Fast food item not found" });
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

      try {
        let query = {};

        if (invoiceId) {
          // If ID parameter is provided, search for void invoice by ID
          const result = await SoldItemsCollection.findOne({
            _id: new ObjectId(invoiceId), // Corrected variable name to invoiceId
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
          // Remove the time part to filter by the entire day
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfDay, $lte: endOfDay } };
        } else if (startDate && endDate) {
          // If both startDate and endDate are provided, filter by date range
          // Remove the time part to filter by the entire day
          const startOfDay = new Date(startDate);
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfDay, $lte: endOfDay } };
        } else if (month) {
          // If month is provided, filter by that specific month
          const startOfMonth = new Date(month);
          startOfMonth.setDate(1); // Set the day to the first day of the month
          startOfMonth.setHours(0, 0, 0, 0);

          const endOfMonth = new Date(month);
          endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
          endOfMonth.setDate(0); // Set the day to the last day of the month
          endOfMonth.setHours(23, 59, 59, 999);

          query = { createdDate: { $gte: startOfMonth, $lte: endOfMonth } };
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

    app.post("/api/post-sold-invoices", async (req, res) => {
      const { table_name, items } = req.body;
      const createdDate = new Date();

      try {
        // Calculate the total price for each item
        const itemsWithTotalPrice = items.map((item) => ({
          ...item,
          total_price: item.item_price_per_unit * item.item_quantity,
        }));

        // Insert the new document
        const result = await SoldItemsCollection.insertOne({
          table_name,
          items: itemsWithTotalPrice,
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
        // Check if a date parameter is provided in the query
        const { date, sortByTitle } = req.query;

        let query = {};

        // If date parameter is provided, add it to the query
        if (date) {
          query.createdDate = {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          };
        }

        let expenses;

        // If sortByTitle is provided, sort the expenses by title
        if (sortByTitle) {
          expenses = await ExpensesCollection.find(query)
            .sort({ title: 1 })
            .toArray();
        } else {
          // If no date parameter is provided, retrieve all expenses
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
