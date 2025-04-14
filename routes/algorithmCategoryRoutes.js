const express = require('express');
const router = express.Router();
const algorithmCategoryController = require('../controllers/algorithmCategoryController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', algorithmCategoryController.getAlgorithmCategoryById);
router.get('/get/all', algorithmCategoryController.getAlgorithmCategoryList);
router.get('/get/paginated', algorithmCategoryController.getPaginatedAlgorithmCategoryList);
router.get('/get/detailed/:id([0-9]+)', algorithmCategoryController.getDetailedAlgorithmCategoryById);
router.get('/get/detailed/all', algorithmCategoryController.getDetailedAlgorithmCategoryList);
router.get('/get/detailed/paginated', algorithmCategoryController.getDetailedPaginatedAlgorithmCategoryList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_MANAGE), (req, res) => {
    res.render('algorithmCategoryManageView', {
        title: 'Manage Algorithm categories',
        pageStyles: ['pagination', 'listTable', 'algorithmCategoryManage'],
        pageScripts: ['pagination', 'tableGenerate', 'algorithmCategoryManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('algorithmCategoryGalleryView', {
        title: 'Algorithm category Gallery',
        pageStyles: ['gallery', 'pagination', 'algorithmCategoryGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'algorithmCategoryGallery'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_CREATE), (req, res) => {
    res.render('algorithmCategoryCreateView', {
        title: 'Create Algorithm category',
        pageStyles: ['create', 'algorithmCategoryCreate'],
        pageScripts: ['algorithmCategoryCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_UPDATE), (req, res) => {
    res.render('algorithmCategoryUpdateView', {
        title: 'Update Algorithm category',
        pageStyles: ['update', 'algorithmCategoryUpdate'],
        pageScripts: ['algorithmCategoryUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_CREATE), algorithmCategoryController.createAlgorithmCategory);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_UPDATE), algorithmCategoryController.updateAlgorithmCategory);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CATEGORY_DELETE), algorithmCategoryController.deleteAlgorithmCategory);

module.exports = router;