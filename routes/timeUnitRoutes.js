const express = require('express');
const router = express.Router();
const timeUnitController = require('../controllers/timeUnitController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', timeUnitController.getTimeUnitById);
router.get('/get/all', timeUnitController.getTimeUnitList);
router.get('/get/paginated', timeUnitController.getPaginatedTimeUnitList);
router.get('/get/detailed/:id([0-9]+)', timeUnitController.getDetailedTimeUnitById);
router.get('/get/detailed/all', timeUnitController.getDetailedTimeUnitList);
router.get('/get/detailed/paginated', timeUnitController.getDetailedPaginatedTimeUnitList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_MANAGE), (req, res) => {
    res.render('timeUnitManageView', {
        title: 'Manage Time units',
        pageStyles: ['pagination', 'listTable', 'timeUnitManage'],
        pageScripts: ['pagination', 'tableGenerate', 'timeUnitManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_CREATE), (req, res) => {
    res.render('timeUnitCreateView', {
        title: 'Create Time Unit',
        pageStyles: ['create', 'timeUnitCreate'],
        pageScripts: ['timeUnitCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_UPDATE), (req, res) => {
    res.render('timeUnitUpdateView', {
        title: 'Update Time Unit',
        pageStyles: ['update', 'timeUnitUpdate'],
        pageScripts: ['timeUnitUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_CREATE), timeUnitController.createTimeUnit);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_UPDATE), timeUnitController.updateTimeUnit);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.TIME_UNIT_DELETE), timeUnitController.deleteTimeUnit);

module.exports = router;