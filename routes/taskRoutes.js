const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', taskController.getTaskById);
router.get('/get/all', taskController.getTaskList);
router.get('/get/paginated', taskController.getPaginatedTaskList);
router.get('/get/detailed/:id([0-9]+)', taskController.getDetailedTaskById);
router.get('/get/detailed/all', taskController.getDetailedTaskList);
router.get('/get/detailed/paginated', taskController.getDetailedPaginatedTaskList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.TASK_MANAGE), (req, res) => {
    res.render('taskManageView', {
        title: 'Manage Tasks',
        pageStyles: ['pagination', 'listTable', 'taskManage'],
        pageScripts: ['pagination', 'tableGenerate', 'taskManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('taskGalleryView', {
        title: 'Task Gallery',
        pageStyles: ['gallery', 'pagination', 'taskGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'taskGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('taskViewView', {
        title: 'Task Details',
        pageStyles: ['view', 'taskHintProvider', 'sortableList', 'selectableElements', 'taskConventions', 'taskSolve', 'taskView'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintProvider', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_CREATE), (req, res) => {
    res.render('taskCreateView', {
        title: 'Create Task',
        pageStyles: ['create', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskCreate'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_UPDATE), (req, res) => {
    res.render('taskUpdateView', {
        title: 'Update Task',
        pageStyles: ['update', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskUpdate'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_CREATE), taskController.createTask);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_UPDATE), taskController.updateTask);
router.post('/check-solution/:id([0-9]+)', taskController.checkTaskSolution);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DELETE), taskController.deleteTask);

module.exports = router;