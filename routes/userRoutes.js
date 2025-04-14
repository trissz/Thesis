const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const OPERATIONS = require('../models/helpers/operations');

router.get('/get/:id([0-9]+)', userController.getUserById);
router.get('/get/all', userController.getUserList);
router.get('/get/paginated', userController.getPaginatedUserList);
router.get('/get/detailed/:id([0-9]+)', userController.getDetailedUserById);
router.get('/get/detailed/all', userController.getDetailedUserList);
router.get('/get/detailed/paginated', userController.getDetailedPaginatedUserList);
router.get('/profile', userController.getUserProfile);
router.get('/profile/:id', userController.getUserProfile);

router.get('/manage', permissionController.authorizeUserForOperation(OPERATIONS.USER_MANAGE), (req, res) => {
    res.render('userManageView', {
        title: 'Manage Users',
        pageStyles: ['pagination', 'listTable', 'userManage'],
        pageScripts: ['pagination', 'tableGenerate', 'userManage'],
    });
});

router.get('/create', (req, res) => {
    res.render('userCreateView', {
        title: 'Create User',
        pageStyles: ['create', 'userCreate'],
        pageScripts: ['userCreate'],
    });
});

router.get('/login', (req, res) => {
    res.render('userLoginView', {
        title: 'Login User',
        pageStyles: ['userLogin'],
        pageScripts: ['userLogin'],
    });
});

router.get('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.USER_UPDATE), (req, res) => {
    res.render('userUpdateView', {
        title: 'Update User',
        pageStyles: ['update', 'userUpdate'],
        pageScripts: ['userUpdate'],
    });
});

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/update/:id', permissionController.authorizeUserForOperation(OPERATIONS.USER_UPDATE), userController.updateUser);
router.delete('/delete/:id', permissionController.authorizeUserForOperation(OPERATIONS.USER_DELETE), userController.deleteUser);

module.exports = router;