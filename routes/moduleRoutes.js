const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', moduleController.getModuleById);
router.get('/get/all/lesson/by/id/:id([0-9]+)', moduleController.getModuleLessonsByModuleId);
router.get('/get/all', moduleController.getModuleList);
router.get('/get/paginated', moduleController.getPaginatedModuleList);
router.get('/get/detailed/:id([0-9]+)', moduleController.getDetailedModuleById);
router.get('/get/detailed/all/lesson/by/id/:id([0-9]+)', moduleController.getDetailedModuleLessonsByModuleId);
router.get('/get/detailed/all', moduleController.getDetailedModuleList);
router.get('/get/detailed/paginated', moduleController.getDetailedPaginatedModuleList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_MANAGE), (req, res) => {
    res.render('moduleManageView', {
        title: 'Manage Modules',
        pageStyles: ['pagination', 'listTable', 'moduleManage'],
        pageScripts: ['pagination', 'tableGenerate', 'moduleManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('moduleGalleryView', {
        title: 'Module Gallery',
        pageStyles: ['gallery', 'pagination', 'moduleGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'moduleGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('moduleViewView', {
        title: 'Module Details',
        pageStyles: ['view', 'moduleView'],
        pageScripts: ['datetime', 'moduleView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_CREATE), (req, res) => {
    res.render('moduleCreateView', {
        title: 'Create Module',
        pageStyles: ['create', 'moduleCreate'],
        pageScripts: ['moduleCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_UPDATE), (req, res) => {
    res.render('moduleUpdateView', {
        title: 'Update Module',
        pageStyles: ['update', 'moduleUpdate'],
        pageScripts: ['moduleUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_CREATE), moduleController.createModule);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_UPDATE), moduleController.updateModule);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.MODULE_DELETE), moduleController.deleteModule);

module.exports = router;