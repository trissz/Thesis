const RoleBo = require('../models/bos/roleBo');
const RoleDo = require('../models/dos/roleDo');
const RoleDto = require('../models/dtos/roleDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const roleBo = new RoleBo();

module.exports = {
    async createRole(req, res)
    {
        let roleDo = new RoleDo();

        roleDo.name = req.body.name;
        roleDo.description = req.body.description;

        /*
        let roleDo = new roleDo(req.body); //?
        */

        try {
            const result = await roleBo.create(roleDo);

            if ( result )
            {
                const roleId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Role created successfully: ID ${roleId}, Name: ${roleDo.name}`);
                return res.redirect('/role/create');
            }
            else
            {
                LogHelper.addError('Cannot create Role');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('roleCreateView', {
                    title: 'Create Role',
                    message: 'Role creation failed. Please try again.',
                    pageStyles: ['create', 'roleCreate'],
                    pageScripts: ['roleCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Role: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('roleCreateView', {
                    title: 'Create Role',
                    message: 'Role name is already in use. Please try a different one.',
                    pageStyles: ['create', 'roleCreate'],
                    pageScripts: ['roleCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('roleCreateView', {
            title: 'Create Role',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'roleCreate'],
            pageScripts: ['roleCreate'],
        });
    },

    async updateRole(req, res)
    {
        let roleDo = new RoleDo();

        roleDo.id = parseInt(req.params.id);
        roleDo.name = req.body.name;
        roleDo.description = req.body.description;
        roleDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await roleBo.update(roleDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Role updated successfully: ID ${roleDo.id}, Name: ${roleDo.name}`);
                return res.redirect(`/role/update/${roleDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Role: ID ${roleDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('roleUpdateView', {
                    title: 'Update Role',
                    message: 'Role update failed. Role not found.',
                    pageStyles: ['update', 'roleUpdate'],
                    pageScripts: ['roleUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Role: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('roleUpdateView', {
                title: 'Update Role',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'roleUpdate'],
                pageScripts: ['roleUpdate'],
            });
        }
    },

    async deleteRole(req, res)
    {
        const roleId = parseInt(req.params.id);
    
        try {
            const result = await roleBo.deleteById(roleId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Role deleted successfully: ID ${roleId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Role deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Role: ID ${roleId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Role not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Role: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getRoleById(req, res)
    {
        const roleId = parseInt(req.params.id);

        try {
            const role = await roleBo.getById(roleId);
    
            if ( !role )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Role not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: role,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching role: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the role.',
            });
        }
    },

    async getRoleList(req, res)
    {
        try {
            const roles = await roleBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: roles,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching role list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the role list.',
            });
        }
    },

    async getPaginatedRoleList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const roles = await roleBo.getPaginated(page, limit);
            const total = await roleBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${roles.length} roles (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    roles,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated roles: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedRoleById(req, res)
    {
        const roleId = parseInt(req.params.id);

        try {
            const role = await roleBo.getDetailedById(roleId);
    
            if ( !role )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Role not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: role,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed role: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed role.',
            });
        }
    },

    async getDetailedRoleList(req, res)
    {
        try {
            const roles = await roleBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: roles,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed role list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed role list.',
            });
        }
    },

    async getDetailedPaginatedRoleList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const roles = await roleBo.getDetailedPaginated(page, limit);
            const total = await roleBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${roles.length} roles (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    roles,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated roles: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};