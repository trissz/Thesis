const express = require('express');
const router = express.Router();
const taskDifficultyLevelController = require('../controllers/taskDifficultyLevelController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', taskDifficultyLevelController.getTaskDifficultyLevelById);
router.get('/get/all', taskDifficultyLevelController.getTaskDifficultyLevelList);
router.get('/get/paginated', taskDifficultyLevelController.getPaginatedTaskDifficultyLevelList);
router.get('/get/detailed/:id([0-9]+)', taskDifficultyLevelController.getDetailedTaskDifficultyLevelById);
router.get('/get/detailed/all', taskDifficultyLevelController.getDetailedTaskDifficultyLevelList);
router.get('/get/detailed/paginated', taskDifficultyLevelController.getDetailedPaginatedTaskDifficultyLevelList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_MANAGE), (req, res) => {
    res.render('taskDifficultyLevelManageView', {
        title: 'Manage Task difficulty levels',
        pageStyles: ['pagination', 'listTable', 'taskDifficultyLevelManage'],
        pageScripts: ['pagination', 'tableGenerate', 'taskDifficultyLevelManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_CREATE), (req, res) => {
    res.render('taskDifficultyLevelCreateView', {
        title: 'Create Task difficulty level',
        pageStyles: ['create', 'taskDifficultyLevelCreate'],
        pageScripts: ['taskDifficultyLevelCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_UPDATE), (req, res) => {
    res.render('taskDifficultyLevelUpdateView', {
        title: 'Update Task difficulty level',
        pageStyles: ['update', 'taskDifficultyLevelUpdate'],
        pageScripts: ['taskDifficultyLevelUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_CREATE), taskDifficultyLevelController.createTaskDifficultyLevel);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_UPDATE), taskDifficultyLevelController.updateTaskDifficultyLevel);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.TASK_DIFFICULTY_LEVEL_DELETE), taskDifficultyLevelController.deleteTaskDifficultyLevel);

module.exports = router;