const { ObjectId } = require("mongodb");

const handleAddComment = async (req, res, CommentCollection) => {
  const { comment, staff, items, table } = req.body;

  try {
    if (!comment || !items) {
      res.status(400).send("missing field");
      return;
    }

    const newComment = comment?.toLowerCase();

    const newData = {
      comment: newComment,
      staff: staff,
      table: table,
      items: [...items],
      createdAt: new Date(),
    };
    const data = await CommentCollection.insertOne(newData);

    res.status(200).json({
      message: "Data inserted successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const handleGetCommentByQuery = async (req, res, CommentCollection) => {
  try {
    const { id, date } = req.query;

    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const exists = await CommentCollection.findOne({ _id: new ObjectId(id) });
      if (!exists) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json({
        message: "Data retrieved successfully",
        data: exists,
      });
    }

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const data = await CommentCollection.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })
        .sort({ createdAt: 1 })
        .toArray();

      if (data.length === 0) {
        return res.status(404).json({
          message: `No data found for the specified date: ${date}`,
        });
      }

      return res.status(200).json({
        message: "Data retrieved successfully",
        data: data,
      });
    }

    const allData = await CommentCollection.find().toArray();
    return res.status(200).json({
      message: "Data retrieved successfully",
      data: allData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = { handleAddComment, handleGetCommentByQuery };
