const path = require("path");
const express = require("express");
const roleController = require("../controllers/roleController");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", roleController.getRoles);
router.post("/", authenticateJWT, roleController.createRole);
router.delete("/", authenticateJWT, roleController.deleteRoles);
router.get("/:roleId", authenticateJWT, roleController.getRoleByID);
router.put("/:roleId", authenticateJWT, roleController.updateRoleByID);
router.delete("/:roleId", authenticateJWT, roleController.deleteRoleByID);

module.exports = router;
