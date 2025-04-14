const express = require('express');
const router = express.Router();
const algorithmImplementationController = require('../controllers/algorithmImplementationController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', algorithmImplementationController.getAlgorithmImplementationById);
router.get('/get/all', algorithmImplementationController.getAlgorithmImplementationList);
router.get('/get/paginated', algorithmImplementationController.getPaginatedAlgorithmImplementationList);
router.get('/get/detailed/:id([0-9]+)', algorithmImplementationController.getDetailedAlgorithmImplementationById);
router.get('/get/detailed/all/by/algorithm-id/:id([0-9]+)', algorithmImplementationController.getDetailedAlgorithmImplementationListByAlgorithmId);
router.get('/get/detailed/all', algorithmImplementationController.getDetailedAlgorithmImplementationList);
router.get('/get/detailed/paginated', algorithmImplementationController.getDetailedPaginatedAlgorithmImplementationList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_MANAGE), (req, res) => {
    res.render('algorithmImplementationManageView', {
        title: 'Manage Algorithm implementations',
        pageStyles: ['pagination', 'listTable', 'algorithmImplementationManage'],
        pageScripts: ['pagination', 'tableGenerate', 'algorithmImplementationManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('algorithmImplementationGalleryView', {
        title: 'Algorithm implementation Gallery',
        pageStyles: ['gallery', 'pagination', 'algorithmImplementationGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'algorithmImplementationGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('algorithmImplementationViewView', {
        title: 'Algorithm implementation Details',
        pageStyles: ['view', 'algorithmImplementationView'],
        pageScripts: ['algorithmImplementationView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_CREATE), (req, res) => {
    res.render('algorithmImplementationCreateView', {
        title: 'Create Algorithm implementation',
        pageStyles: ['codeEditor', 'create', 'algorithmImplementationCreate'],
        pageLibraries: [
            {directory: 'monaco', script: 'loader'}
        ],
        pageScripts: ['codeEditor', 'algorithmImplementationCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_UPDATE), (req, res) => {
    res.render('algorithmImplementationUpdateView', {
        title: 'Update Algorithm implementation',
        pageStyles: ['codeEditor', 'update', 'algorithmImplementationUpdate'],
        pageLibraries: [
            {directory: 'monaco', script: 'loader'}
        ],
        pageScripts: ['codeEditor', 'algorithmImplementationUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_CREATE), algorithmImplementationController.createAlgorithmImplementation);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_UPDATE), algorithmImplementationController.updateAlgorithmImplementation);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.ALGORITHM_IMPLEMENTATION_DELETE), algorithmImplementationController.deleteAlgorithmImplementation);

module.exports = router;