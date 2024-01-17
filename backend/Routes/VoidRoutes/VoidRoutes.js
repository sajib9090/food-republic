const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

async function getVoidInvoices(req, res, VoidInvoicesCollection) {
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
}
module.exports = { getVoidInvoices };
