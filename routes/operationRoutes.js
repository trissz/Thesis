const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', operationController.getOperationById);
router.get('/get/all', operationController.getOperationList);
router.get('/get/paginated', operationController.getPaginatedOperationList);
router.get('/get/detailed/:id([0-9]+)', operationController.getDetailedOperationById);
router.get('/get/detailed/all', operationController.getDetailedOperationList);
router.get('/get/detailed/paginated', operationController.getDetailedPaginatedOperationList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_MANAGE), (req, res) => {
    res.render('operationManageView', {
        title: 'Manage Operations',
        pageStyles: ['listTable', 'operationManage'],
        pageScripts: ['tableGenerate', 'operationManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_CREATE), (req, res) => {
    res.render('operationCreateView', {
        title: 'Create Operation',
        pageStyles: ['create', 'operationCreate'],
        pageScripts: ['operationCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_UPDATE), (req, res) => {
    res.render('operationUpdateView', {
        title: 'Update Operation',
        pageStyles: ['update', 'operationUpdate'],
        pageScripts: ['operationUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_CREATE), operationController.createOperation);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_UPDATE), operationController.updateOperation);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.OPERATION_DELETE), operationController.deleteOperation);

module.exports = router;