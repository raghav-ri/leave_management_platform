const express = require("express");
const router = express.Router();
const {
  applyReimbursement,
  getMyReimbursements,
  getAllReimbursements,
  approveReimbursement,
  rejectReimbursement,
} = require("../controllers/reimbursementController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ─── EMPLOYEE ROUTES ────────────────────────────────────────
// Submit a new reimbursement request
router.post("/apply", protect, authorizeRoles("employee"), applyReimbursement);

// Get own reimbursement history
router.get("/my", protect, authorizeRoles("employee"), getMyReimbursements);

// ─── MANAGER / ADMIN ROUTES ─────────────────────────────────
// Get all reimbursement requests
router.get("/all", protect, authorizeRoles("manager", "admin"), getAllReimbursements);

// Approve a reimbursement
router.put("/approve/:id", protect, authorizeRoles("manager", "admin"), approveReimbursement);

// Reject a reimbursement
router.put("/reject/:id", protect, authorizeRoles("manager", "admin"), rejectReimbursement);

module.exports = router;