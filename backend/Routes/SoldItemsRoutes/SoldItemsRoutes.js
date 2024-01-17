const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getSoldInvoices(req, res, SoldItemsCollection) {
  const invoiceId = req.query.id;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const date = req.query.date;
  const itemName = req.query.itemName;
  const month = req.query.month;
  const frId = req.query.frId;

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
      // If frId is provided, filter by fr_id and use findOne
      const result = await SoldItemsCollection.findOne({
        fr_id: parseInt(frId),
      });

      if (!result) {
        return res.status(404).json({ message: "No matching result for frId" });
      }

      return res.json({
        message: "Sold invoice retrieved successfully",
        soldInvoice: result,
      });
    }

    if (itemName) {
      // If itemName is provided, add a case-insensitive regular expression query
      query["items.item_name"] = { $regex: new RegExp(itemName, "i") };
    }

    const soldInvoices = await SoldItemsCollection.find(query).toArray();

    return res.json({
      message: "Sold invoices retrieved successfully",
      soldInvoices,
    });
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res.status(500).send("Error retrieving sold invoices from the database");
  }
}

async function getSoldInvoiceSummary(req, res, SoldItemsCollection) {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    let query = {};

    if (startDate && endDate) {
      // If both startDate and endDate are provided, filter by date range
      const startOfDay = new Date(startDate);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      query = { createdDate: { $gte: startOfDay, $lte: endOfDay } };
    }

    const soldInvoices = await SoldItemsCollection.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdDate" },
            },
            itemName: "$items.item_name",
          },
          totalQuantity: { $sum: "$items.item_quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          items: {
            $push: {
              itemName: "$_id.itemName",
              totalQuantity: "$totalQuantity",
            },
          },
        },
      },
    ]).toArray();

    return res.json({
      message: "Sold invoices summary retrieved successfully",
      soldInvoicesSummary: soldInvoices,
    });
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res
      .status(500)
      .send("Error retrieving sold invoices summary from the database");
  }
}

async function getSoldInvoiceByMonthDetails(req, res, SoldItemsCollection) {
  const { month } = req.query;

  try {
    if (!month) {
      return res.status(400).json({
        message: "Provide a valid 'month' parameter",
      });
    }

    const startOfMonth = new Date(month);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(month);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const query = { createdDate: { $gte: startOfMonth, $lte: endOfMonth } };

    const aggregatePipeline = [
      { $match: query },
      {
        $group: {
          _id: { $dayOfMonth: "$createdDate" },
          daily_total_sell: { $sum: "$total_bill" },
          daily_total_discount: { $sum: "$total_discount" },
          createdDate: { $first: "$createdDate" },
        },
      },
      {
        $project: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdDate",
            },
          },
          createdDate: 1,
          daily_total_sell: 1,
          daily_total_discount: 1,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const dailyTotals = await SoldItemsCollection.aggregate(
      aggregatePipeline
    ).toArray();

    let maxTotal = 0;
    let maxTotalDate;
    let minTotal = Infinity;
    let minTotalDate;

    dailyTotals.forEach((dailyTotal) => {
      if (dailyTotal.daily_total_sell > maxTotal) {
        maxTotal = dailyTotal.daily_total_sell;
        maxTotalDate = dailyTotal._id;
      }

      if (dailyTotal.daily_total_sell < minTotal) {
        minTotal = dailyTotal.daily_total_sell;
        minTotalDate = dailyTotal._id;
      }
    });

    return res.json({
      message: "Sold invoices by date details retrieved successfully",
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
      .send("Error retrieving sold invoices by date details from the database");
  }
}

async function updateSoldInvoicesItemQuantity(req, res, SoldItemsCollection) {
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

async function addSoldInvoices(req, res, SoldItemsCollection) {
  const { table_name, served_by, items, total_bill, total_discount, member } =
    req.body;
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

    // Get the inserted ID
    const insertedId = result.insertedId;

    res.json({
      message: "Data added successfully",
      fr_id: latestFrId + 1, // Return the fr_id of the inserted document
      insertedId,
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    res.status(500).send("Error inserting data into the database");
  }
}

module.exports = {
  getSoldInvoices,
  getSoldInvoiceSummary,
  getSoldInvoiceByMonthDetails,
  updateSoldInvoicesItemQuantity,
  addSoldInvoices,
};
