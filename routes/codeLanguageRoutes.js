const express = require('express');
const router = express.Router();
const codeLanguageController = require('../controllers/codeLanguageController');
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', codeLanguageController.getCodeLanguageById);
router.get('/get/all', codeLanguageController.getCodeLanguageList);
router.get('/get/paginated', codeLanguageController.getPaginatedCodeLanguageList);
router.get('/get/detailed/:id([0-9]+)', codeLanguageController.getDetailedCodeLanguageById);
router.get('/get/detailed/all', codeLanguageController.getDetailedCodeLanguageList);
router.get('/get/detailed/paginated', codeLanguageController.getDetailedPaginatedCodeLanguageList);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_MANAGE), (req, res) => {
    res.render('codeLanguageManageView', {
        title: 'Manage Code languages',
        pageStyles: ['pagination', 'listTable', 'codeLanguageManage'],
        pageScripts: ['pagination', 'tableGenerate', 'codeLanguageManage'],
    });
});

router.get('/create', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_CREATE), (req, res) => {
    res.render('codeLanguageCreateView', {
        title: 'Create Code language',
        pageStyles: ['create', 'codeLanguageCreate'],
        pageScripts: ['codeLanguageCreate'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_UPDATE), (req, res) => {
    res.render('codeLanguageUpdateView', {
        title: 'Update Code language',
        pageStyles: ['update', 'codeLanguageUpdate'],
        pageScripts: ['codeLanguageUpdate'],
    });
});

router.post('/create', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_CREATE), codeLanguageController.createCodeLanguage);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_UPDATE), codeLanguageController.updateCodeLanguage);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.CODE_LANGUAGE_DELETE), codeLanguageController.deleteCodeLanguage);

module.exports = router;