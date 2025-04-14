const express = require('express');
const router = express.Router();
const algorithmComplexityController = require('../controllers/algorithmComplexityController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', algorithmComplexityController.getAlgorithmComplexityById);
router.get('/get/all', algorithmComplexityController.getAlgorithmComplexityList);
router.get('/get/paginated', algorithmComplexityController.getPaginatedAlgorithmComplexityList);
router.get('/get/detailed/:id([0-9]+)', algorithmComplexityController.getDetailedAlgorithmComplexityById);
router.get('/get/detailed/all', algorithmComplexityController.getDetailedAlgorithmComplexityList);
router.get('/get/detailed/paginated', algorithmComplexityController.getDetailedPaginatedAlgorithmComplexityList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_MANAGE), (req, res) => {
    res.render('algorithmComplexityManageView', {
        title: 'Manage Algorithm complexities',
        pageStyles: ['pagination', 'listTable', 'algorithmComplexityManage'],
        pageScripts: ['pagination', 'tableGenerate', 'algorithmComplexityManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_CREATE), (req, res) => {
    res.render('algorithmComplexityCreateView', {
        title: 'Create Algorithm complexity',
        pageStyles: ['create', 'algorithmComplexityCreate'],
        pageScripts: ['algorithmComplexityCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_UPDATE), (req, res) => {
    res.render('algorithmComplexityUpdateView', {
        title: 'Update Algorithm complexity',
        pageStyles: ['update', 'algorithmComplexityUpdate'],
        pageScripts: ['algorithmComplexityUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_CREATE), algorithmComplexityController.createAlgorithmComplexity);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_UPDATE), algorithmComplexityController.updateAlgorithmComplexity);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_COMPLEXITY_DELETE), algorithmComplexityController.deleteAlgorithmComplexity);

module.exports = router;