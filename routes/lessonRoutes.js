const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', lessonController.getLessonById);
router.get('/get/all/by/module-id/:id([0-9]+)', lessonController.getLessonListByModuleId);
router.get('/get/all', lessonController.getLessonList);
router.get('/get/paginated', lessonController.getPaginatedLessonList);
router.get('/get/detailed/:id([0-9]+)', lessonController.getDetailedLessonById);
router.get('/get/detailed/all/by/module-id/:id([0-9]+)', lessonController.getDetailedLessonListByModuleId);
router.get('/get/detailed/all', lessonController.getDetailedLessonList);
router.get('/get/detailed/paginated', lessonController.getDetailedPaginatedLessonList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_MANAGE), (req, res) => {
    res.render('lessonManageView', {
        title: 'Manage Lessons',
        pageStyles: ['pagination', 'listTable', 'lessonManage'],
        pageScripts: ['pagination', 'tableGenerate', 'lessonManage'],
    });
});

router.get('/gallery', (req, res) => {
    res.render('lessonGalleryView', {
        title: 'Lesson Gallery',
        pageStyles: ['gallery', 'pagination', 'lessonGallery'],
        pageScripts: ['galleryListGenerate', 'pagination', 'datetime', 'lessonGallery'],
    });
});

router.get('/view/:id', (req, res) => {
    res.render('lessonViewView', {
        title: 'Lesson Details',
        pageStyles: ['view', 'lessonView'],
        pageScripts: ['lessonView'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_CREATE), (req, res) => {
    res.render('lessonCreateView', {
        title: 'Create Lesson',
        pageStyles: ['create', 'lessonCreate'],
        pageScripts: ['lessonCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_UPDATE), (req, res) => {
    res.render('lessonUpdateView', {
        title: 'Update Lesson',
        pageStyles: ['update', 'lessonUpdate'],
        pageScripts: ['lessonUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_CREATE), lessonController.createLesson);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_UPDATE), lessonController.updateLesson);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.LESSON_DELETE), lessonController.deleteLesson);

module.exports = router;