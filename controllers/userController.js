const UserBo = require('../models/bos/userBo');
const UserDo = require('../models/dos/userDo');
const UserDto = require('../models/dtos/userDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const userBo = new UserBo();

module.exports = {
    async createUser(req, res)
    {
        let userDo = new UserDo();

        userDo.roleId = req.body.role_id;
        userDo.name = req.body.name;
        userDo.email = req.body.email;
        userDo.password = req.body.password;
        userDo.passwordAgain = req.body.password_again;

        /*
        let userDo = new UserDo(req.body); //?
        */

        try {
            const result = await userBo.create(userDo);

            if ( result )
            {
                const userId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`User created successfully: ID ${userId}, Name: ${userDo.name}, Email: ${userDo.email}`);
                return res.redirect('/user/login');
            }
            else
            {
                LogHelper.addError('Cannot create User');
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('userCreateView', {
                    title: 'Create User',
                    message: 'User creation failed. Please try again.',
                    pageStyles: ['create', 'userCreate'],
                    pageScripts: ['userCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating User: ${error.message}`);
            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('userCreateView', {
                    title: 'Create User',
                    message: 'Email is already in use. Please try a different one.',
                    pageStyles: ['create', 'userCreate'],
                    pageScripts: ['userCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('userCreateView', {
            title: 'Create User',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'userCreate'],
            pageScripts: ['userCreate'],
        });
    },

    async updateUser(req, res)
    {
        let userDo = new UserDo();

        userDo.id = parseInt(req.params.id);
        userDo.name = req.body.name;
        userDo.password = req.body.password;
        userDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await userBo.update(userDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`User updated successfully: ID ${userDo.id}, Name: ${userDo.name}`);
                return res.redirect(`/user/update/${userDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update User: ID ${userDo.id}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('userUpdateView', {
                    title: 'Update User',
                    message: 'User update failed. User not found.',
                    pageStyles: ['update', 'userUpdate'],
                    pageScripts: ['userUpdate'],
                    userId: userDo.id,
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating User: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('userUpdateView', {
                title: 'Update User',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'userUpdate'],
                pageScripts: ['userUpdate'],
                userId: userDo.id,
            });
        }
    },

    async deleteUser(req, res)
    {
        const userId = parseInt(req.params.id);
    
        try {
            const result = await userBo.deleteById(userId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`User deleted successfully: ID ${userId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'User deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete User: ID ${userId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'User not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting User: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async loginUser(req, res)
    {
        let userDo = new UserDo();

        userDo.email = req.body.email;
        userDo.password = req.body.password;

        /*
        let userDo = new UserDo(req.body); //?
        */
        
        try {
            let loginEmail = userDo.email;
            userDo = await userBo.login(userDo);
            
            if ( !UtilityHelper.isset(userDo) || !UtilityHelper.isset(userDo.id) )
            {
                LogHelper.addError(`Failed to login user with email ${loginEmail}`);
                return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).render('userLoginView', {
                    title: 'Login User',
                    message: 'User login failed.',
                    pageStyles: ['userLogin'],
                    pageScripts: ['userLogin']
                });
            }

            LogHelper.addConfirmation(`User found with ID #${userDo.id}`);
            let response = await userBo.updateLastLoginById(userDo.id);

            if ( response.affectedRows > 0 && response.changedRows > 0 )
            {
                LogHelper.addConfirmation(`User last login datetime successfully updated.`);
            }
            else
            {
                LogHelper.addWarning(`Last login datetime was not updated. It may already be up-to-date.`);
            }            

            req.session.userId = userDo.id;
            res.redirect('/user/profile');
        }
        catch ( error ) {
            LogHelper.addError(`Error during login user: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('userLoginView', {
                title: 'Login User',
                message: 'Error during login user.',
                pageStyles: ['userLogin'],
                pageScripts: ['userLogin']
            });
        }
    },

    async logoutUser(req, res)
    {
        try {
            req.session.destroy((err) => {
                if ( err )
                {
                    LogHelper.addError(`Error during user logout: ${err.message}`);
                    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Could not log out' });
                    return;
                }
    
                LogHelper.addConfirmation(`User with session ID ${req.sessionID} logged out successfully`);
                res.clearCookie('connect.sid', { path: '/' });
                res.redirect('/user/login');
            });
        } catch ( error ) {
            LogHelper.addError(`Unexpected error during logout: ${error.message}`);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Unexpected error during logout' });
        }
    },

    async getUserProfile(req, res)
    {
        let userId = req.params.id;

        if ( !UtilityHelper.isset(userId) && UtilityHelper.isset(req.session.userId) )
        {
            LogHelper.addMessage('No user ID provided, using session ID');
            userId = req.session.userId;
        }

        if ( UtilityHelper.isset(userId) && UtilityHelper.isset(req.session.userId) && userId === req.session.userId )
        {
            LogHelper.addMessage('It is your profile');
        }

        if ( !UtilityHelper.isset(userId) )
        {
            LogHelper.addError('No user ID provided');
            return res.redirect('/user/login');
        }
    
        try {
            const userDo = await userBo.getById(userId);
    
            if ( !UtilityHelper.isset(userDo) || !UtilityHelper.isset(userDo.id) )
            {
                LogHelper.addError(`User not found with ID ${userId}`);
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('errorView', { 
                    title: 'Error', 
                    message: 'No user ID provided',
                    pageStyles: ['error'],
                    pageScripts: ['error'],
                });
            }
    
            LogHelper.addConfirmation(`User found with ID #${userDo.id}`);
            res.render('userProfileView', {
                title: `${userDo.name}'s Profile`,
                userDo,
                pageStyles: ['userProfile'],
                pageScripts: ['userProfile'],
            });
        } catch ( error ) {
            LogHelper.addError(`Error during get user profile: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('errorView', { 
                title: 'Error', 
                message: 'No user ID provided',
                pageStyles: ['error'],
                pageScripts: ['error'],
            });
        }
    },

    async getUserById(req, res)
    {
        const userId = parseInt(req.params.id);

        try {
            const user = await userBo.getById(userId);
    
            if ( !user )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'User not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: user,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching user: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the user.',
            });
        }
    },

    async getUserList(req, res)
    {
        try {
            const users = await userBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: users,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching user list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the user list.',
            });
        }
    },

    async getPaginatedUserList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const users = await userBo.getPaginated(page, limit);
            const total = await userBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${users.length} users (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    users,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated users: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedUserById(req, res)
    {
        const userId = parseInt(req.params.id);

        try {
            const user = await userBo.getDetailedById(userId);
    
            if ( !user )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'User not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: user,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed user: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed user.',
            });
        }
    },

    async getDetailedUserList(req, res)
    {
        try {
            const users = await userBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: users,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed user list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed user list.',
            });
        }
    },

    async getDetailedPaginatedUserList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const users = await userBo.getDetailedPaginated(page, limit);
            const total = await userBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${users.length} users (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    users,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated users: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};