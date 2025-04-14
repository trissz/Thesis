const express = require('express');
const router = express.Router();
const sortBasedTaskController = require('../controllers/sortBasedTaskController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', sortBasedTaskController.getSortBasedTaskById);
router.get('/get/all', sortBasedTaskController.getSortBasedTaskList);
router.get('/get/paginated', sortBasedTaskController.getPaginatedSortBasedTaskList);
router.get('/get/detailed/:id([0-9]+)', sortBasedTaskController.getDetailedSortBasedTaskById);
router.get('/get/detailed/all', sortBasedTaskController.getDetailedSortBasedTaskList);
router.get('/get/detailed/paginated', sortBasedTaskController.getDetailedPaginatedSortBasedTaskList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_MANAGE), (req, res) => {
    res.render('sortBasedTaskManageView', {
        title: 'Manage Sort based tasks',
        pageStyles: ['pagination', 'listTable', 'sortBasedTaskManage'],
        pageScripts: ['pagination', 'tableGenerate', 'sortBasedTaskManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('sortBasedTaskGalleryView', {
        title: 'Sort based task Gallery',
        pageStyles: ['gallery', 'pagination', 'sortBasedTaskGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'sortBasedTaskGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('sortBasedTaskViewView', {
        title: 'Sort based task Details',
        pageStyles: ['view', 'taskHintProvider', 'sortableList', 'taskSolve', 'sortBasedTaskView'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintProvider', 'sortableListHandler', 'sortBasedTaskView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_CREATE), (req, res) => {
    res.render('sortBasedTaskCreateView', {
        title: 'Create Sort based task',
        pageStyles: ['create', 'taskHintManager', 'sortableList', 'sortBasedTaskCreate'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_UPDATE), (req, res) => {
    res.render('sortBasedTaskUpdateView', {
        title: 'Update Sort based task',
        pageStyles: ['update', 'taskHintManager', 'sortableList', 'sortBasedTaskUpdate'],
        pageLibraries: [
            {directory: 'sortable', script: 'sortable.min'}
        ],
        pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_CREATE), sortBasedTaskController.createSortBasedTask);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_UPDATE), sortBasedTaskController.updateSortBasedTask);
router.post('/check-solution/:id([0-9]+)', sortBasedTaskController.checkSortBasedTaskSolution);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.SORT_BASED_TASK_DELETE), sortBasedTaskController.deleteSortBasedTask);

module.exports = router;