const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', roleController.getRoleById);
router.get('/get/all', roleController.getRoleList);
router.get('/get/paginated', roleController.getPaginatedRoleList);
router.get('/get/detailed/:id([0-9]+)', roleController.getDetailedRoleById);
router.get('/get/detailed/all', roleController.getDetailedRoleList);
router.get('/get/detailed/paginated', roleController.getDetailedPaginatedRoleList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_MANAGE), (req, res) => {
    res.render('roleManageView', {
        title: 'Manage Roles',
        pageStyles: ['pagination', 'listTable', 'roleManage'],
        pageScripts: ['pagination', 'tableGenerate', 'roleManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_CREATE), (req, res) => {
    res.render('roleCreateView', {
        title: 'Create Role',
        pageStyles: ['create', 'roleCreate'],
        pageScripts: ['roleCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_UPDATE), (req, res) => {
    res.render('roleUpdateView', {
        title: 'Update Role',
        pageStyles: ['update', 'roleUpdate'],
        pageScripts: ['roleUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_CREATE), roleController.createRole);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_UPDATE), roleController.updateRole);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ROLE_DELETE), roleController.deleteRole);

module.exports = router;