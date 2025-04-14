const PermissionBo = require('../models/bos/permissionBo');
const PermissionDo = require('../models/dos/permissionDo');
const PermissionDto = require('../models/dtos/permissionDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const permissionBo = new PermissionBo();

module.exports = {
    async savePermissions(req, res)
    {
        const operationsToAddIds = req.body.operations_to_add_ids;
        const operationsToRemoveIds = req.body.operations_to_remove_ids;
        const targetRoleId = parseInt(req.body.target_role_id);

        try {
            operationsToAddIds.forEach(async (operationToAddId) => {
                let permissionDo = new PermissionDo();
                permissionDo.operationId = operationToAddId;
                permissionDo.roleId = targetRoleId;
                await permissionBo.create(permissionDo);
            });
    
            operationsToRemoveIds.forEach(async (operationToRemoveId) => {
                let permissionDo = await permissionBo.getByRoleIdAndOperationId(targetRoleId, operationToRemoveId);
                await permissionBo.deleteById(permissionDo.id);
            });

            LogHelper.addConfirmation("Permissions saved successfully");
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
            });
        } catch ( error ) {
            LogHelper.addError("Failed to save permissions");
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while saving permissions.',
            });
        }
    },

    async createPermission(req, res)
    {
        let permissionDo = new PermissionDo();

        permissionDo.roleId = req.body.role_id;
        permissionDo.operationId = req.body.operation_id;

        /*
        let permissionDo = new permissionDo(req.body); //?
        */

        try {
            const result = await permissionBo.create(permissionDo);

            if ( result )
            {
                const permissionId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Permission created successfully: ID ${permissionId}`);
                return res.redirect('/permission/create');
            }
            else
            {
                LogHelper.addError('Cannot create Permission');
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('permissionCreateView', {
                    title: 'Create Permission',
                    message: 'Permission creation failed. Please try again.',
                    pageStyles: ['create', 'permissionCreate'],
                    pageScripts: ['permissionCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Permission: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('permissionCreateView', {
                    title: 'Create Permission',
                    message: 'Operation for Permission is already granted in permissions.',
                    pageStyles: ['create', 'permissionCreate'],
                    pageScripts: ['permissionCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('permissionCreateView', {
            title: 'Create Permission',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'permissionCreate'],
            pageScripts: ['permissionCreate'],
        });
    },

    async updatePermission(req, res)
    {
        let permissionDo = new PermissionDo();

        permissionDo.id = parseInt(req.params.id);
        permissionDo.roleId = parseInt(req.body.role_id);
        permissionDo.operationId = parseInt(req.body.operation_id);
        permissionDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await permissionBo.update(permissionDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Permission updated successfully: ID ${permissionDo.id}`);
                return res.redirect(`/permission/update/${permissionDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Permission: ID ${permissionDo.id}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('permissionUpdateView', {
                    title: 'Update Permission',
                    message: 'Permission update failed. Permission not found.',
                    pageStyles: ['update', 'permissionUpdate'],
                    pageScripts: ['permissionUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Permission: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('permissionUpdateView', {
                title: 'Update Permission',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'permissionUpdate'],
                pageScripts: ['permissionUpdate'],
            });
        }
    },

    async deletePermission(req, res)
    {
        const permissionId = parseInt(req.params.id);
    
        try {
            const result = await permissionBo.deleteById(permissionId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Permission deleted successfully: ID ${permissionId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Permission deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Permission: ID ${permissionId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Permission not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Permission: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    authorizeUserForOperation: (operationId) => async (req, res, next) => {
        const userId = req.cookies.userId || req.session.userId;

        if ( !userId )
        {
            LogHelper.addError('You must log in to access this resource.');
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).render('userLoginView', {
                title: 'User login',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['userLogin'],
                pageScripts: ['userLogin'],
            });
        }

        const hasPermission = await permissionBo.hasPermission(userId, operationId);

        if ( !hasPermission )
        {
            LogHelper.addError('Access denied: insufficient permissions.');
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).render('indexView', {
                title: 'Home',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['index'],
                pageScripts: ['index'],
            });
        }

        LogHelper.addConfirmation('Access granted for user.');

        next();
    },

    async getPermissionById(req, res)
    {
        const permissionId = parseInt(req.params.id);

        try {
            const permission = await permissionBo.getById(permissionId);
    
            if ( !permission )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Permission not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: permission,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching permission: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the permission.',
            });
        }
    },

    async getPermissionList(req, res)
    {
        try {
            const permissions = await permissionBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: permissions,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching permission list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the permission list.',
            });
        }
    },

    async getPaginatedPermissionList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const permissions = await permissionBo.getPaginated(page, limit);
            const total = await permissionBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${permissions.length} permissions (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    permissions,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated permissions: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedPermissionById(req, res)
    {
        const permissionId = parseInt(req.params.id);

        try {
            const permission = await permissionBo.getDetailedById(permissionId);
    
            if ( !permission )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Permission not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: permission,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed permission: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed permission.',
            });
        }
    },

    async getDetailedPermissionList(req, res)
    {
        try {
            const permissions = await permissionBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: permissions,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed permission list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed permission list.',
            });
        }
    },

    async getDetailedPaginatedPermissionList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const permissions = await permissionBo.getDetailedPaginated(page, limit);
            const total = await permissionBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${permissions.length} permissions (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    permissions,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated permissions: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getPermissionsByRoleId(req, res)
    {
        try {
            const permissions = await permissionBo.getAllByRoleId(req.params.id);
    
            if ( !permissions )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Permissions not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: permissions,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching permissions: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the permissions.',
            });
        }
    },
};