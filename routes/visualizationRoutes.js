const express = require('express');
const router = express.Router();
const visualizationController = require('../controllers/visualizationController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', visualizationController.getVisualizationById);
router.get('/get/all', visualizationController.getVisualizationList);
router.get('/get/paginated', visualizationController.getPaginatedVisualizationList);
router.get('/get/detailed/:id([0-9]+)', visualizationController.getDetailedVisualizationById);
router.get('/get/detailed/all', visualizationController.getDetailedVisualizationList);
router.get('/get/detailed/paginated', visualizationController.getDetailedPaginatedVisualizationList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_MANAGE), (req, res) => {
    res.render('visualizationManageView', {
        title: 'Manage Visualizations',
        pageStyles: ['pagination', 'listTable', 'visualizationManage'],
        pageScripts: ['pagination', 'tableGenerate', 'visualizationManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('visualizationGalleryView', {
        title: 'Visualization Gallery',
        pageStyles: ['gallery', 'pagination', 'visualizationGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'visualizationGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('visualizationViewView', {
        title: 'Visualization Details',
        pageStyles: ['view', 'canvas', 'visualizationView'],
        pageLibraries: [
            {directory: 'p5', script: 'p5'},
            {directory: 'p5', script: 'p5.dom'}
        ],
        pageScripts: ['canvas', 'visualizationView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_CREATE), (req, res) => {
    res.render('visualizationCreateView', {
        title: 'Create Visualization',
        pageStyles: ['codeEditor', 'create', 'visualizationCreate'],
        pageLibraries: [
            {directory: 'monaco', script: 'loader'}
        ],
        pageScripts: ['codeEditor', 'visualizationCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_UPDATE), (req, res) => {
    res.render('visualizationUpdateView', {
        title: 'Update Visualization',
        pageStyles: ['codeEditor', 'update', 'visualizationUpdate'],
        pageLibraries: [
            {directory: 'monaco', script: 'loader'}
        ],
        pageScripts: ['codeEditor', 'visualizationUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_CREATE), visualizationController.createVisualization);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_UPDATE), visualizationController.updateVisualization);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.VISUALIZATION_DELETE), visualizationController.deleteVisualization);

module.exports = router;