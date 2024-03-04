const path = require('path');
const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();

router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.delete('/', roleController.deleteRoles);
router.get('/:roleId', roleController.getRoleByID);
router.put('/:roleId', roleController.updateRoleByID);
router.delete('/:roleId', roleController.deleteRoleByID);

module.exports = router;