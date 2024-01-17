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
    app.get("/api/get-menu-items", (req, res) =>
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
    app.get("/api/tables", (req, res) => getTables(req, res, tableCollection));
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
    //void routes
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
