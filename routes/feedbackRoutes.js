const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', feedbackController.getFeedbackById);
router.get('/get/all', feedbackController.getFeedbackList);
router.get('/get/paginated', feedbackController.getPaginatedFeedbackList);
router.get('/get/detailed/:id([0-9]+)', feedbackController.getDetailedFeedbackById);
router.get('/get/detailed/all', feedbackController.getDetailedFeedbackList);
router.get('/get/detailed/paginated', feedbackController.getDetailedPaginatedFeedbackList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_MANAGE), (req, res) => {
    res.render('feedbackManageView', {
        title: 'Manage Feedback',
        pageStyles: ['pagination', 'listTable', 'feedbackManage'],
        pageScripts: ['pagination', 'tableGenerate', 'feedbackManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_CREATE), (req, res) => {
    res.render('feedbackCreateView', {
        title: 'Create Feedback',
        pageStyles: ['create', 'feedbackCreate'],
        pageScripts: ['feedbackCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_UPDATE), (req, res) => {
    res.render('feedbackUpdateView', {
        title: 'Update Feedback',
        pageStyles: ['update', 'feedbackUpdate'],
        pageScripts: ['feedbackUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_CREATE), feedbackController.createFeedback);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_UPDATE), feedbackController.updateFeedback);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.FEEDBACK_DELETE), feedbackController.deleteFeedback);

module.exports = router;