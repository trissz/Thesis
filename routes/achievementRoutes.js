const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', achievementController.getAchievementById);
router.get('/get/all', achievementController.getAchievementList);
router.get('/get/paginated', achievementController.getPaginatedAchievementList);
router.get('/get/detailed/:id([0-9]+)', achievementController.getDetailedAchievementById);
router.get('/get/detailed/all', achievementController.getDetailedAchievementList);
router.get('/get/detailed/paginated', achievementController.getDetailedPaginatedAchievementList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_MANAGE), (req, res) => {
    res.render('achievementManageView', {
        title: 'Manage Achievements',
        pageStyles: ['pagination', 'listTable', 'achievementManage'],
        pageScripts: ['pagination', 'tableGenerate', 'achievementManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CREATE), (req, res) => {
    res.render('achievementCreateView', {
        title: 'Create Achievement',
        pageStyles: ['create', 'achievementCreate'],
        pageScripts: ['achievementCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_UPDATE), (req, res) => {
    res.render('achievementUpdateView', {
        title: 'Update Achievement',
        pageStyles: ['update', 'achievementUpdate'],
        pageScripts: ['achievementUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CREATE), achievementController.createAchievement);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_UPDATE), achievementController.updateAchievement);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_DELETE), achievementController.deleteAchievement);

module.exports = router;