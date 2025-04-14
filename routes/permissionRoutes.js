const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', permissionController.getPermissionById);
router.get('/get/all', permissionController.getPermissionList);
router.get('/get/paginated', permissionController.getPaginatedPermissionList);
router.get('/get/detailed/:id([0-9]+)', permissionController.getDetailedPermissionById);
router.get('/get/detailed/all', permissionController.getDetailedPermissionList);
router.get('/get/detailed/paginated', permissionController.getDetailedPaginatedPermissionList);
router.get('/get/all/by/role-id/:id([0-9]+)', permissionController.getPermissionsByRoleId);

router.get('/manager', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_MANAGE), (req, res) => {
    res.render('permissionManagerView', {
        title: 'Permission manager',
        pageStyles: ['permissionManager'],
        pageScripts: ['permissionManager'],
    });
});

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_MANAGE), (req, res) => {
    res.render('permissionManageView', {
        title: 'Manage Permissions',
        pageStyles: ['pagination', 'listTable', 'permissionManage'],
        pageScripts: ['pagination', 'tableGenerate', 'permissionManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_CREATE), (req, res) => {
    res.render('permissionCreateView', {
        title: 'Create Permission',
        pageStyles: ['create', 'permissionCreate'],
        pageScripts: ['permissionCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_UPDATE), (req, res) => {
    res.render('permissionUpdateView', {
        title: 'Update Permission',
        pageStyles: ['update', 'permissionUpdate'],
        pageScripts: ['permissionUpdate'],
    });
});

router.post('/save', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_CREATE), permissionController.savePermissions);
router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_CREATE), permissionController.createPermission);
router.post('/update/:id([0-9]+)', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_UPDATE), permissionController.updatePermission);
router.delete('/delete/:id([0-9]+)', permissionController.authorizeUserForOperation(OPERATIONS.PERMISSION_DELETE), permissionController.deletePermission);

module.exports = router;