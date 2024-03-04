const { ObjectId } = require("mongodb");

async function getExpenses(req, res, ExpensesCollection) {
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
}

async function getExpensesByQuery(req, res, ExpensesCollection) {
  try {
    const { month, startDate, endDate } = req.query;

    let query = {};

    if (month) {
      const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
      const endOfMonth = new Date(
        new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1
      );

      query.createdDate = {
        $gte: startOfMonth,
        $lt: endOfMonth,
      };
    } else if (startDate && endDate) {
      // If start and end dates are provided, add them to the query
      query.createdDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    let pipeline = [
      { $match: query },
      { $sort: { createdDate: 1 } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdDate" },
          },
          expenses: { $push: "$$ROOT" },
          totalExpenses: { $sum: "$expense_price" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    let result = await ExpensesCollection.aggregate(pipeline).toArray();

    res.json({
      message: `Expenses retrieved successfully`,
      result,
    });
  } catch (error) {
    console.error("Database Query Error:", error);
    res.status(500).send("Error fetching expenses from the database");
  }
}

async function addExpense(req, res, ExpensesCollection) {
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
}

async function removeExpense(req, res, ExpensesCollection) {
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
}
module.exports = { getExpenses, getExpensesByQuery, addExpense, removeExpense };
