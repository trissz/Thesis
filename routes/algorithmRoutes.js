const express = require('express');
const router = express.Router();
const algorithmController = require('../controllers/algorithmController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', algorithmController.getAlgorithmById);
router.get('/get/all', algorithmController.getAlgorithmList);
router.get('/get/paginated', algorithmController.getPaginatedAlgorithmList);
router.get('/get/detailed/:id([0-9]+)', algorithmController.getDetailedAlgorithmById);
router.get('/get/detailed/all', algorithmController.getDetailedAlgorithmList);
router.get('/get/detailed/paginated', algorithmController.getDetailedPaginatedAlgorithmList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_MANAGE), (req, res) => {
    res.render('algorithmManageView', {
        title: 'Manage Algorithms',
        pageStyles: ['pagination', 'listTable', 'algorithmManage'],
        pageScripts: ['pagination', 'tableGenerate', 'algorithmManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('algorithmGalleryView', {
        title: 'Algorithm Gallery',
        pageStyles: ['gallery', 'pagination', 'algorithmGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'algorithmGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('algorithmViewView', {
        title: 'Algorithm Details',
        pageStyles: ['view', 'algorithmView'],
        pageScripts: ['algorithmView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CREATE), (req, res) => {
    res.render('algorithmCreateView', {
        title: 'Create Algorithm',
        pageStyles: ['create', 'algorithmCreate'],
        pageScripts: ['algorithmCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_UPDATE), (req, res) => {
    res.render('algorithmUpdateView', {
        title: 'Update Algorithm',
        pageStyles: ['update', 'algorithmUpdate'],
        pageScripts: ['algorithmUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_CREATE), algorithmController.createAlgorithm);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_UPDATE), algorithmController.updateAlgorithm);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_DELETE), algorithmController.deleteAlgorithm);

module.exports = router;