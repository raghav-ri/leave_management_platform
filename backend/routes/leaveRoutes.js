const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  approveLeave,
  rejectLeave
} = require("../controllers/leaveController");

router.post("/apply", protect, authorizeRoles("employee"), applyLeave);

router.get("/my", protect, authorizeRoles("employee"), getMyLeaves);

router.get("/all", protect, authorizeRoles("manager", "admin"), getAllLeaves);

router.put("/approve/:id", protect, authorizeRoles("manager", "admin"), approveLeave);

router.put("/reject/:id", protect, authorizeRoles("manager", "admin"), rejectLeave);

module.exports = router;