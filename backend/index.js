const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cron = require("node-cron");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();
const port = process.env.PORT || 8000;

//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const {
  getCategory,
  addCategory,
} = require("./Routes/CategoryRoutes/CategoryRoutes");
const {
  getOrders,
  addOrders,
  removeOrders,
} = require("./Routes/OrderRoutes/OrderRoutes");
const {
  getMenuItems,
  editMenuItem,
  addMenuItem,
  removeMenuItem,
} = require("./Routes/MenuRoutes/MenuRoutes");
const {
  getUsers,
  editUserById,
  addUser,
} = require("./Routes/userRoutes/userRoutes");
const {
  getTables,
  addTable,
  removeTableByName,
  editTableById,
} = require("./Routes/TableRoutes/TableRoutes");
const {
  getSoldInvoices,
  getSoldInvoiceSummary,
  updateSoldInvoicesItemQuantity,
  addSoldInvoices,
  getSoldInvoiceByMonthDetails,
} = require("./Routes/SoldItemsRoutes/SoldItemsRoutes");
const { getVoidInvoices } = require("./Routes/VoidRoutes/VoidRoutes");
const {
  getExpenses,
  getExpensesByQuery,
  addExpense,
  removeExpense,
} = require("./Routes/ExpenseRoutes/ExpenseRoutes");
const {
  getMembers,
  editMemberByMobile,
  addMember,
  removeMember,
} = require("./Routes/MemberRoutes/MemberRoutes");
const {
  getStaffs,
  addStaff,
  removeStaff,
} = require("./Routes/StaffRoutes/StaffRoutes");
const {
  handleAddComment,
  handleGetCommentByQuery,
} = require("./Routes/CommentRouts/CommentRoutes");
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

    const CommentCollection = client.db("FoodRepublic").collection("comments");
    const SubscriptionCollection = client
      .db("FoodRepublic")
      .collection("subscription");

    // API endpoint to get the list of tables from the collection
    cron.schedule("0 0 10 * *", async () => {
      try {
        const subscription = await SubscriptionCollection.findOne();

        if (subscription) {
          const updatedTotalDue =
            subscription.total_due + subscription.monthly_bill;

          await SubscriptionCollection.updateOne(
            { _id: new ObjectId(subscription._id) },
            { $set: { total_due: updatedTotalDue, updatedAt: new Date() } }
          );

          console.log("Total due has been updated.");
        } else {
          console.log("No subscription found.");
        }
      } catch (error) {
        console.error("Error updating total due:", error);
      }
    });

    const checkSubscription = async (req, res, next) => {
      try {
        const result = await SubscriptionCollection.findOne();

        const expiresAtDate = new Date(result?.expiresAt);
        const currentDate = new Date();

        const remainingDays = Math.ceil(
          (expiresAtDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        if (remainingDays < 1) {
          return res.status(403).json({
            message: `Your subscription is expired.`,
            dueAmount: result?.total_due || "N/A",
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };

    app.get("/api/subscription", async (req, res) => {
      try {
        const result = await SubscriptionCollection.findOne();

        res.json(result);
      } catch (error) {
        console.error("Database Fetching Error:", error);
        res.status(500).send("Error fetching data from the database");
      }
    });

    app.patch("/api/update-subscription-payment-info", async (req, res) => {
      try {
        const { method, amount, account } = req.body;

        if (!method || !account || !amount) {
          return res.status(400).json({
            message: "Please provide payment method and account details.",
          });
        }

        const newData = {
          type: method,
          account_no: account,
          amount: amount,
          createdAt: new Date(),
        };

        const subscription = await SubscriptionCollection.findOneAndUpdate(
          { _id: new ObjectId("666af751e7b8980a27dddfd7") },
          { $push: { payment_info: newData } },
          { new: true, upsert: true }
        );

        if (!subscription) {
          return res.status(404).json({ message: "Subscription not found" });
        }

        res.json({
          message: "Payment info updated",
        });
      } catch (error) {
        console.error("Database Fetching Error:", error);
        res.status(500).send("Error updating data from the database");
      }
    });

    app.patch("/api/update-subscription", async (req, res) => {
      try {
        const { day, total_due } = req.body;

        let dayNumber = parseInt(day) || 0;
        let dueAmount = parseFloat(total_due) || 0;

        const updateFields = {};

        if (dayNumber) {
          const currentDate = new Date();
          const expiresAt = new Date(
            currentDate.setDate(currentDate.getDate() + dayNumber)
          );
          expiresAt.setHours(23, 59, 59, 999);
          updateFields.expiresAt = expiresAt;
        }

        if (dueAmount) {
          updateFields.total_due = dueAmount;
        }

        if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const subscription = await SubscriptionCollection.findOne();

        if (!subscription) {
          console.log("No subscription found.");
          return res.status(404).json({ error: "No subscription found" });
        }

        await SubscriptionCollection.updateOne(
          { _id: new ObjectId(subscription._id) },
          { $set: updateFields }
        );

        console.log(`Subscription updated: ${JSON.stringify(updateFields)}`);
        res.json({
          message: "Subscription updated",
          updatedFields: updateFields,
        });
      } catch (error) {
        console.error("Database Fetching Error:", error);
        res.status(500).send("Error updating data from the database");
      }
    });

    app.post("/api/comment/add", (req, res) => {
      handleAddComment(req, res, CommentCollection);
    });

    app.get("/api/comments", (req, res) => {
      handleGetCommentByQuery(req, res, CommentCollection);
    });

    //category routes
    app.get("/api/get-categories", (req, res) =>
      getCategory(req, res, CategoryCollection)
    );
    app.post("/api/add-category", (req, res) =>
      addCategory(req, res, CategoryCollection)
    );

    //orders routes
    app.get("/api/get-orders", (req, res) =>
      getOrders(req, res, OrderCollection)
    );
    app.post("/api/add-order-staff", (req, res) =>
      addOrders(req, res, OrderCollection)
    );
    app.delete("/api/delete-order", (req, res) =>
      removeOrders(req, res, OrderCollection)
    );

    //menu routes
    app.get("/api/get-menu-items", checkSubscription, (req, res) =>
      getMenuItems(req, res, MenuItemsCollection)
    );
    app.patch("/api/edit-menu-item/:itemId", (req, res) =>
      editMenuItem(req, res, MenuItemsCollection)
    );
    app.post("/api/add-menu-item", (req, res) =>
      addMenuItem(req, res, MenuItemsCollection)
    );
    app.delete("/api/delete-menu-item/:itemId", (req, res) =>
      removeMenuItem(req, res, MenuItemsCollection)
    );

    //user routes
    app.get("/api/get-users", (req, res) =>
      getUsers(req, res, usersCollection)
    );
    app.patch("/api/update-user/:id", (req, res) =>
      editUserById(req, res, usersCollection)
    );
    app.post("/api/add-user", (req, res) => addUser(req, res, usersCollection));

    //table routes
    app.get("/api/tables", checkSubscription, (req, res) =>
      getTables(req, res, tableCollection)
    );
    app.patch("/api/table/:id", (req, res) =>
      editTableById(req, res, tableCollection)
    );
    app.post("/api/add-table", (req, res) =>
      addTable(req, res, tableCollection)
    );
    app.delete("/api/delete-table/:name", (req, res) =>
      removeTableByName(req, res, tableCollection)
    );

    // sold invoice api, this api can serve data by the help of id, date, start & end date, item name and month
    app.get("/api/get-sold-invoices", (req, res) =>
      getSoldInvoices(req, res, SoldItemsCollection)
    );
    app.get("/api/get-sold-invoices-summary", (req, res) =>
      getSoldInvoiceSummary(req, res, SoldItemsCollection)
    );
    app.get("/api/get-sold-invoices-by-date-details", (req, res) =>
      getSoldInvoiceByMonthDetails(req, res, SoldItemsCollection)
    );
    app.patch("/api/patch-sold-invoices-update-item-quantity", (req, res) =>
      updateSoldInvoicesItemQuantity(req, res, SoldItemsCollection)
    );
    app.post("/api/post-sold-invoices", (req, res) =>
      addSoldInvoices(req, res, SoldItemsCollection)
    );

    //void routes
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
    app.get("/api/get-void-invoices", (req, res) =>
      getVoidInvoices(req, res, VoidInvoicesCollection)
    );

    //expense routes
    app.get("/api/get-expenses", (req, res) =>
      getExpenses(req, res, ExpensesCollection)
    );
    app.get("/api/get-expenses-by-query", (req, res) =>
      getExpensesByQuery(req, res, ExpensesCollection)
    );
    app.post("/api/post-expense", (req, res) =>
      addExpense(req, res, ExpensesCollection)
    );
    app.delete("/api/delete-expense", (req, res) =>
      removeExpense(req, res, ExpensesCollection)
    );

    //members routes
    app.get("/api/get-members", (req, res) =>
      getMembers(req, res, MemberCollection)
    );
    app.patch("/api/update-member/:mobile", (req, res) =>
      editMemberByMobile(req, res, MemberCollection)
    );
    app.post("/api/add-member", (req, res) =>
      addMember(req, res, MemberCollection)
    );
    app.delete("/api/delete-member", (req, res) =>
      removeMember(req, res, MemberCollection)
    );

    //staff routes
    app.get("/api/get-all-staff", (req, res) =>
      getStaffs(req, res, StaffCollection)
    );
    app.post("/api/add-staff", (req, res) =>
      addStaff(req, res, StaffCollection)
    );
    app.delete("/api/delete-staff/:id", (req, res) =>
      removeStaff(req, res, StaffCollection)
    );
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
