const Leave = require("../models/Leave");

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      user: req.user.id,
      startDate,
      endDate,
      reason
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Manager/Admin view all requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user", "name email role");
    res.json(leaves);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Employee view own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id });
    res.json(leaves);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Approve leave
exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "approved";
    await leave.save();

    res.json({ message: "Leave approved", leave });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Reject leave
exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "rejected";
    await leave.save();

    res.json({ message: "Leave rejected", leave });
  } catch (error) {
    res.status(500).json(error.message);
  }
};