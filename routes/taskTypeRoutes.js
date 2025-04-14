const express = require('express');
const router = express.Router();
const taskTypeController = require('../controllers/taskTypeController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', taskTypeController.getTaskTypeById);
router.get('/get/all', taskTypeController.getTaskTypeList);
router.get('/get/paginated', taskTypeController.getPaginatedTaskTypeList);
router.get('/get/detailed/:id([0-9]+)', taskTypeController.getDetailedTaskTypeById);
router.get('/get/detailed/all', taskTypeController.getDetailedTaskTypeList);
router.get('/get/detailed/paginated', taskTypeController.getDetailedPaginatedTaskTypeList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_MANAGE), (req, res) => {
    res.render('taskTypeManageView', {
        title: 'Manage Task types',
        pageStyles: ['pagination', 'listTable', 'taskTypeManage'],
        pageScripts: ['pagination', 'tableGenerate', 'taskTypeManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_CREATE), (req, res) => {
    res.render('taskTypeCreateView', {
        title: 'Create Task type',
        pageStyles: ['editor', 'create', 'taskTypeCreate'],
        pageScripts: ['taskTypeCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_UPDATE), (req, res) => {
    res.render('taskTypeUpdateView', {
        title: 'Update Task type',
        pageStyles: ['update', 'taskTypeUpdate'],
        pageScripts: ['taskTypeUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_CREATE), taskTypeController.createTaskType);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_UPDATE), taskTypeController.updateTaskType);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_TYPE_DELETE), taskTypeController.deleteTaskType);

module.exports = router;