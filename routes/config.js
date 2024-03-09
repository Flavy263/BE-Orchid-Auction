const express = require("express");
const passport = require("passport");
const configController = require("../controllers/configController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, configController.getAllConfig);
router.get("/:config_id", authenticateJWT, configController.getConfigByConfigId);
router.get("/:type_config", authenticateJWT, configController.getConfigByTypeConfig);
router.post("/", authenticateJWT, configController.createConfig);
router.put("/:config_id", authenticateJWT, configController.updateConfigById);
router.delete("/:config_id", authenticateJWT, configController.deleteConfigByID);
module.exports = router;
