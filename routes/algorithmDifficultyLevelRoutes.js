const express = require('express');
const router = express.Router();
const algorithmDifficultyLevelController = require('../controllers/algorithmDifficultyLevelController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', algorithmDifficultyLevelController.getAlgorithmDifficultyLevelById);
router.get('/get/all', algorithmDifficultyLevelController.getAlgorithmDifficultyLevelList);
router.get('/get/paginated', algorithmDifficultyLevelController.getPaginatedAlgorithmDifficultyLevelList);
router.get('/get/detailed/:id([0-9]+)', algorithmDifficultyLevelController.getDetailedAlgorithmDifficultyLevelById);
router.get('/get/detailed/all', algorithmDifficultyLevelController.getDetailedAlgorithmDifficultyLevelList);
router.get('/get/detailed/paginated', algorithmDifficultyLevelController.getDetailedPaginatedAlgorithmDifficultyLevelList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_MANAGE), (req, res) => {
    res.render('algorithmDifficultyLevelManageView', {
        title: 'Manage Algorithm difficulty levels',
        pageStyles: ['pagination', 'listTable', 'algorithmDifficultyLevelManage'],
        pageScripts: ['pagination', 'tableGenerate', 'algorithmDifficultyLevelManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_CREATE), (req, res) => {
    res.render('algorithmDifficultyLevelCreateView', {
        title: 'Create Algorithm difficulty level',
        pageStyles: ['create', 'algorithmDifficultyLevelCreate'],
        pageScripts: ['algorithmDifficultyLevelCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_UPDATE), (req, res) => {
    res.render('algorithmDifficultyLevelUpdateView', {
        title: 'Update Algorithm difficulty level',
        pageStyles: ['update', 'algorithmDifficultyLevelUpdate'],
        pageScripts: ['algorithmDifficultyLevelUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_CREATE), algorithmDifficultyLevelController.createAlgorithmDifficultyLevel);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_UPDATE), algorithmDifficultyLevelController.updateAlgorithmDifficultyLevel);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DIFFICULTY_LEVEL_DELETE), algorithmDifficultyLevelController.deleteAlgorithmDifficultyLevel);

module.exports = router;