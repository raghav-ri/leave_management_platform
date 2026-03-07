const Reimbursement = require("../models/Reimbursement");

// ─── EMPLOYEE ───────────────────────────────────────────────

// POST /api/reimbursements/apply
// Employee submits a reimbursement request
const applyReimbursement = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reimbursement = await Reimbursement.create({
      employee: req.user.id,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json(reimbursement);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reimbursements/my
// Employee views their own reimbursement requests
const getMyReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({ employee: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reimbursements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── MANAGER / ADMIN ────────────────────────────────────────

// GET /api/reimbursements/all
// Manager/Admin views all reimbursement requests
const getAllReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });
    res.json(reimbursements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/reimbursements/approve/:id
// Manager/Admin approves a reimbursement
const approveReimbursement = async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("employee", "name email");

    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement request not found" });
    }

    res.json({ message: "Reimbursement approved", reimbursement });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/reimbursements/reject/:id
// Manager/Admin rejects a reimbursement
const rejectReimbursement = async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("employee", "name email");

    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement request not found" });
    }

    res.json({ message: "Reimbursement rejected", reimbursement });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  applyReimbursement,
  getMyReimbursements,
  getAllReimbursements,
  approveReimbursement,
  rejectReimbursement,
};