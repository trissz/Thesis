const express = require('express');
const router = express.Router();
const inputBasedTaskController = require('../controllers/inputBasedTaskController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', inputBasedTaskController.getInputBasedTaskById);
router.get('/get/all', inputBasedTaskController.getInputBasedTaskList);
router.get('/get/paginated', inputBasedTaskController.getPaginatedInputBasedTaskList);
router.get('/get/detailed/:id([0-9]+)', inputBasedTaskController.getDetailedInputBasedTaskById);
router.get('/get/detailed/all', inputBasedTaskController.getDetailedInputBasedTaskList);
router.get('/get/detailed/paginated', inputBasedTaskController.getDetailedPaginatedInputBasedTaskList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_MANAGE), (req, res) => {
    res.render('inputBasedTaskManageView', {
        title: 'Manage Input based tasks',
        pageStyles: ['pagination', 'listTable', 'inputBasedTaskManage'],
        pageScripts: ['pagination', 'tableGenerate', 'inputBasedTaskManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('inputBasedTaskGalleryView', {
        title: 'Input based task Gallery',
        pageStyles: ['gallery', 'pagination', 'inputBasedTaskGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'inputBasedTaskGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('inputBasedTaskViewView', {
        title: 'Input based task Details',
        pageStyles: ['view', 'taskHintProvider', 'taskSolve', 'inputBasedTaskView'],
        pageScripts: ['taskHintProvider', 'inputBasedTaskView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_CREATE), (req, res) => {
    res.render('inputBasedTaskCreateView', {
        title: 'Create Input based task',
        pageStyles: ['create', 'taskHintManager', 'inputBasedTaskCreate'],
        pageScripts: ['taskHintManager', 'inputBasedTaskCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_UPDATE), (req, res) => {
    res.render('inputBasedTaskUpdateView', {
        title: 'Update Input based task',
        pageStyles: ['update', 'taskHintManager', 'inputBasedTaskUpdate'],
        pageScripts: ['taskHintManager', 'inputBasedTaskUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_CREATE), inputBasedTaskController.createInputBasedTask);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_UPDATE), inputBasedTaskController.updateInputBasedTask);
router.post('/check-solution/:id([0-9]+)', inputBasedTaskController.checkInputBasedTaskSolution);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.INPUT_BASED_TASK_DELETE), inputBasedTaskController.deleteInputBasedTask);

module.exports = router;