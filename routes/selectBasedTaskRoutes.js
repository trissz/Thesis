const express = require('express');
const router = express.Router();
const selectBasedTaskController = require('../controllers/selectBasedTaskController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', selectBasedTaskController.getSelectBasedTaskById);
router.get('/get/all', selectBasedTaskController.getSelectBasedTaskList);
router.get('/get/paginated', selectBasedTaskController.getPaginatedSelectBasedTaskList);
router.get('/get/detailed/:id([0-9]+)', selectBasedTaskController.getDetailedSelectBasedTaskById);
router.get('/get/detailed/all', selectBasedTaskController.getDetailedSelectBasedTaskList);
router.get('/get/detailed/paginated', selectBasedTaskController.getDetailedPaginatedSelectBasedTaskList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_MANAGE), (req, res) => {
    res.render('selectBasedTaskManageView', {
        title: 'Manage Select based tasks',
        pageStyles: ['pagination', 'listTable', 'selectBasedTaskManage'],
        pageScripts: ['pagination', 'tableGenerate', 'selectBasedTaskManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('selectBasedTaskGalleryView', {
        title: 'Select based task Gallery',
        pageStyles: ['gallery', 'pagination', 'selectBasedTaskGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'selectBasedTaskGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('selectBasedTaskViewView', {
        title: 'Select based task Details',
        pageStyles: ['view', 'taskHintProvider', 'selectableElements', 'taskSolve', 'selectBasedTaskView'],
        pageScripts: ['taskHintProvider', 'selectableElementsHandler', 'selectBasedTaskView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_CREATE), (req, res) => {
    res.render('selectBasedTaskCreateView', {
        title: 'Create Select based task',
        pageStyles: ['create', 'taskHintManager', 'selectableElements', 'selectBasedTaskCreate'],
        pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_UPDATE), (req, res) => {
    res.render('selectBasedTaskUpdateView', {
        title: 'Update Select based task',
        pageStyles: ['update', 'taskHintManager', 'selectableElements', 'selectBasedTaskUpdate'],
        pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_CREATE), selectBasedTaskController.createSelectBasedTask);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_UPDATE), selectBasedTaskController.updateSelectBasedTask);
router.post('/check-solution/:id([0-9]+)', selectBasedTaskController.checkSelectBasedTaskSolution);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.SELECT_BASED_TASK_DELETE), selectBasedTaskController.deleteSelectBasedTask);

module.exports = router;