const express = require('express');
const router = express.Router();
const achievementCategoryController = require('../controllers/achievementCategoryController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', achievementCategoryController.getAchievementCategoryById);
router.get('/get/all', achievementCategoryController.getAchievementCategoryList);
router.get('/get/paginated', achievementCategoryController.getPaginatedAchievementCategoryList);
router.get('/get/detailed/:id([0-9]+)', achievementCategoryController.getDetailedAchievementCategoryById);
router.get('/get/detailed/all', achievementCategoryController.getDetailedAchievementCategoryList);
router.get('/get/detailed/paginated', achievementCategoryController.getDetailedPaginatedAchievementCategoryList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_MANAGE), (req, res) => {
    res.render('achievementCategoryManageView', {
        title: 'Manage Achievement categories',
        pageStyles: ['pagination', 'listTable', 'achievementCategoryManage'],
        pageScripts: ['pagination', 'tableGenerate', 'achievementCategoryManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('achievementCategoryGalleryView', {
        title: 'Achievement category Gallery',
        pageStyles: ['gallery', 'pagination', 'achievementCategoryGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'achievementCategoryGallery'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_CREATE), (req, res) => {
    res.render('achievementCategoryCreateView', {
        title: 'Create Achievement category',
        pageStyles: ['create', 'achievementCategoryCreate'],
        pageScripts: ['achievementCategoryCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_UPDATE), (req, res) => {
    res.render('achievementCategoryUpdateView', {
        title: 'Update Achievement category',
        pageStyles: ['update', 'achievementCategoryUpdate'],
        pageScripts: ['achievementCategoryUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_CREATE), achievementCategoryController.createAchievementCategory);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_UPDATE), achievementCategoryController.updateAchievementCategory);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ACHIEVEMENT_CATEGORY_DELETE), achievementCategoryController.deleteAchievementCategory);

module.exports = router;