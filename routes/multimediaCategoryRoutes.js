const express = require('express');
const router = express.Router();
const multimediaCategoryController = require('../controllers/multimediaCategoryController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', multimediaCategoryController.getMultimediaCategoryById);
router.get('/get/all', multimediaCategoryController.getMultimediaCategoryList);
router.get('/get/paginated', multimediaCategoryController.getPaginatedMultimediaCategoryList);
router.get('/get/detailed/:id([0-9]+)', multimediaCategoryController.getDetailedMultimediaCategoryById);
router.get('/get/detailed/all', multimediaCategoryController.getDetailedMultimediaCategoryList);
router.get('/get/detailed/paginated', multimediaCategoryController.getDetailedPaginatedMultimediaCategoryList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_MANAGE), (req, res) => {
    res.render('multimediaCategoryManageView', {
        title: 'Manage Multimedia categories',
        pageStyles: ['pagination', 'listTable', 'multimediaCategoryManage'],
        pageScripts: ['pagination', 'tableGenerate', 'multimediaCategoryManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_CREATE), (req, res) => {
    res.render('multimediaCategoryCreateView', {
        title: 'Create Multimedia category',
        pageStyles: ['create', 'multimediaCategoryCreate'],
        pageScripts: ['multimediaCategoryCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_UPDATE), (req, res) => {
    res.render('multimediaCategoryUpdateView', {
        title: 'Update Multimedia category',
        pageStyles: ['update', 'multimediaCategoryUpdate'],
        pageScripts: ['multimediaCategoryUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_CREATE), multimediaCategoryController.createMultimediaCategory);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_UPDATE), multimediaCategoryController.updateMultimediaCategory);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_CATEGORY_DELETE), multimediaCategoryController.deleteMultimediaCategory);

module.exports = router;