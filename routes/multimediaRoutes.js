const express = require('express');
const router = express.Router();
const multimediaController = require('../controllers/multimediaController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', multimediaController.getMultimediaById);
router.get('/get/all', multimediaController.getMultimediaList);
router.get('/get/paginated', multimediaController.getPaginatedMultimediaList);
router.get('/get/detailed/:id([0-9]+)', multimediaController.getDetailedMultimediaById);
router.get('/get/detailed/all', multimediaController.getDetailedMultimediaList);
router.get('/get/detailed/paginated', multimediaController.getDetailedPaginatedMultimediaList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_MANAGE), (req, res) => {
    res.render('multimediaManageView', {
        title: 'Manage Multimedia',
        pageStyles: ['pagination', 'listTable', 'multimediaManage'],
        pageScripts: ['pagination', 'tableGenerate', 'multimediaManage'],
    });
});

router.get('/upload', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_UPLOAD), (req, res) => {
    res.render('multimediaUploadView', {
        title: 'Upload File',
        pageStyles: ['create', 'multimediaUpload'],
        pageScripts: ['multimediaUpload'],
    });
});

router.post('/upload', permissionController.authorizeUserForOperation(OPERATIONS.MULTIMEDIA_UPLOAD), multimediaController.uploadFile);

module.exports = router;