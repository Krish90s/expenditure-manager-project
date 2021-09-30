const { Expense } = require("../models/expense");
const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();

router.get(
  "/allexpenses/:firstDay/:lastDay/:userId",
  auth,
  async (req, res) => {
    let firstDay = req.params.firstDay;
    let lastDay = req.params.lastDay;
    try {
      let expenses = await Expense.find({
        $and: [
          { incurred_on: { $gte: firstDay, $lte: lastDay } },
          { recorded_by: req.params.userId },
        ],
      })
        .sort("incurred_on")
        .populate("recorded_by", "_id name");
      res.send(expenses);
    } catch (error) {
      return res.status(400).send(error.details[0].message);
    }
  }
);

router.post("/add-expense", auth, async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    return res.send("Expense recorded!");
  } catch (err) {
    res.status(400).send(error.details[0].message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      category: req.body.category,
      amount: req.body.amount,
      incurred_on: req.body.incurred_on,
      notes: req.body.notes,
      updated: Date.now(),
      created: req.body.created,
      recorded_by: req.body.recorded_by,
    },
    { new: true }
  );

  if (!expense) return res.status(404).send("Expense not Found");
  expense.title = req.body.title;
  expense.category = req.body.category;
  expense.amount = req.body.amount;
  expense.incurred_on = req.body.incurred_on;
  expense.notes = req.body.notes;
  expense.updated = Date.now();
  expense.created = req.body.created;
  expense.recorded_by = req.body.recorded_by;
});

router.delete("/:id", auth, async (req, res) => {
  const expense = await Expense.findByIdAndRemove(req.params.id);
  if (!expense) return res.status(404).send("Expense not Found");
  res.send("Expense Removed");
});

router.get("/current/preview/:id", auth, async (req, res) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    let currentPreview = await Expense.aggregate([
      {
        $facet: {
          month: [
            {
              $match: {
                incurred_on: { $gte: firstDay, $lt: lastDay },
                recorded_by: mongoose.Types.ObjectId(req.params.id),
              },
            },
            {
              $group: { _id: "currentMonth", totalSpent: { $sum: "$amount" } },
            },
          ],
          today: [
            {
              $match: {
                incurred_on: { $gte: today, $lt: tomorrow },
                recorded_by: mongoose.Types.ObjectId(req.params.id),
              },
            },
            { $group: { _id: "today", totalSpent: { $sum: "$amount" } } },
          ],
          yesterday: [
            {
              $match: {
                incurred_on: { $gte: yesterday, $lt: today },
                recorded_by: mongoose.Types.ObjectId(req.params.id),
              },
            },
            { $group: { _id: "yesterday", totalSpent: { $sum: "$amount" } } },
          ],
        },
      },
    ]);
    let expensePreview = {
      month: currentPreview[0].month[0],
      today: currentPreview[0].today[0],
      yesterday: currentPreview[0].yesterday[0],
    };
    res.send(expensePreview);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }
});

router.get("/by/category/:id", auth, async (req, res) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  try {
    let categoryMonthlyAvg = await Expense.aggregate([
      {
        $facet: {
          average: [
            { $match: { recorded_by: mongoose.Types.ObjectId(req.params.id) } },
            {
              $group: {
                _id: {
                  category: "$category",
                  month: { $month: "$incurred_on" },
                },
                totalSpent: { $sum: "$amount" },
              },
            },
            {
              $group: {
                _id: "$_id.category",
                avgSpent: { $avg: "$totalSpent" },
              },
            },
            {
              $project: {
                _id: "$_id",
                value: { average: "$avgSpent" },
              },
            },
          ],
          total: [
            {
              $match: {
                incurred_on: { $gte: firstDay, $lte: lastDay },
                recorded_by: mongoose.Types.ObjectId(req.params.id),
              },
            },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
            {
              $project: {
                _id: "$_id",
                value: { total: "$totalSpent" },
              },
            },
          ],
        },
      },
      {
        $project: {
          overview: { $setUnion: ["$average", "$total"] },
        },
      },
      { $unwind: "$overview" },
      { $replaceRoot: { newRoot: "$overview" } },
      { $group: { _id: "$_id", mergedValues: { $mergeObjects: "$value" } } },
    ]).exec();
    res.send(categoryMonthlyAvg);
  } catch (err) {
    console.log(err);
    return res.status(400).send(error.details[0].message);
  }
});

router.get("/plot-expenses/:month/:id", auth, async (req, res) => {
  const date = new Date(req.params.month),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  try {
    let totalMonthly = await Expense.aggregate([
      {
        $match: {
          incurred_on: { $gte: firstDay, $lt: lastDay },
          recorded_by: mongoose.Types.ObjectId(req.params.id),
        },
      },
      { $project: { x: { $dayOfMonth: "$incurred_on" }, y: "$amount" } },
    ]).exec();
    res.send(totalMonthly);
  } catch (err) {
    return res.status(400).send(error.details[0].message);
  }
});

router.get("/yearly-expenses/:year/:id", auth, async (req, res) => {
  const y = req.params.year;
  const firstDay = new Date(y, 0, 1);
  const lastDay = new Date(y, 12, 0);
  try {
    let totalMonthly = await Expense.aggregate([
      {
        $match: {
          incurred_on: { $gte: firstDay, $lt: lastDay },
          recorded_by: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $group: {
          _id: { $month: "$incurred_on" },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $project: { x: "$_id", y: "$totalSpent" } },
    ]).exec();

    res.json({ monthTot: totalMonthly });
  } catch (err) {
    return res.status(400).send(error.details[0].message);
  }
});

router.get(
  "/category-expenses/:firstDay/:lastDay/:id",
  auth,
  async (req, res) => {
    const firstDay = new Date(req.params.firstDay);
    const lastDay = new Date(req.params.lastDay);

    try {
      let categoryMonthlyAvg = await Expense.aggregate([
        {
          $match: {
            incurred_on: { $gte: firstDay, $lte: lastDay },
            recorded_by: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $group: {
            _id: { category: "$category" },
            totalSpent: { $sum: "$amount" },
          },
        },
        { $group: { _id: "$_id.category", avgSpent: { $avg: "$totalSpent" } } },
        { $project: { x: "$_id", y: "$avgSpent" } },
      ]).exec();
      res.json({ monthAVG: categoryMonthlyAvg });
    } catch (err) {
      console.log(err);
      return res.status(400).send(error.details[0].message);
    }
  }
);

module.exports = router;
