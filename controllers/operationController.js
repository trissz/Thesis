const OperationBo = require('../models/bos/operationBo');
const OperationDo = require('../models/dos/operationDo');
const OperationDto = require('../models/dtos/operationDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const operationBo = new OperationBo();

module.exports = {
    async createOperation(req, res)
    {
        let operationDo = new OperationDo();

        operationDo.name = req.body.name;
        operationDo.description = req.body.description;

        /*
        let operationDo = new operationDo(req.body); //?
        */

        try {
            const result = await operationBo.create(operationDo);

            if ( result )
            {
                const operationId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Operation created successfully: ID ${operationId}, Name: ${operationDo.name}`);
                return res.redirect('/operation/create');
            }
            else
            {
                LogHelper.addError('Cannot create Operation');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('operationCreateView', {
                    title: 'Create Operation',
                    message: 'Operation creation failed. Please try again.',
                    pageStyles: ['create', 'operationCreate'],
                    pageScripts: ['operationCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Operation: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('operationCreateView', {
                    title: 'Create Operation',
                    message: 'Operation name is already in use. Please try a different one.',
                    pageStyles: ['create', 'operationCreate'],
                    pageScripts: ['operationCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('operationCreateView', {
            title: 'Create Operation',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'operationCreate'],
            pageScripts: ['operationCreate'],
        });
    },

    async updateOperation(req, res)
    {
        let operationDo = new OperationDo();

        operationDo.id = parseInt(req.params.id);
        operationDo.name = req.body.name;
        operationDo.description = req.body.description;
        operationDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await operationBo.update(operationDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Operation updated successfully: ID ${operationDo.id}, Name: ${operationDo.name}`);
                return res.redirect(`/operation/update/${operationDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Operation: ID ${operationDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('operationUpdateView', {
                    title: 'Update Operation',
                    message: 'Operation update failed. Operation not found.',
                    pageStyles: ['update', 'operationUpdate'],
                    pageScripts: ['operationUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Operation: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('operationUpdateView', {
                title: 'Update Operation',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'operationUpdate'],
                pageScripts: ['operationUpdate'],
            });
        }
    },

    async deleteOperation(req, res)
    {
        const operationId = parseInt(req.params.id);
    
        try {
            const result = await operationBo.deleteById(operationId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Operation deleted successfully: ID ${operationId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Operation deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Operation: ID ${operationId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Operation not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Operation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getOperationById(req, res)
    {
        const operationId = parseInt(req.params.id);

        try {
            const operation = await operationBo.getById(operationId);
    
            if ( !operation )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Operation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: operation,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching operation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the operation.',
            });
        }
    },

    async getOperationList(req, res)
    {
        try {
            const operations = await operationBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: operations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching operation list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the operation list.',
            });
        }
    },

    async getPaginatedOperationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const operations = await operationBo.getPaginated(page, limit);
            const total = await operationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${operations.length} operations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    operations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated operations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedOperationById(req, res)
    {
        const operationId = parseInt(req.params.id);

        try {
            const operation = await operationBo.getDetailedById(operationId);
    
            if ( !operation )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Operation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: operation,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed operation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed operation.',
            });
        }
    },

    async getDetailedOperationList(req, res)
    {
        try {
            const operations = await operationBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: operations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed operation list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed operation list.',
            });
        }
    },

    async getDetailedPaginatedOperationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const operations = await operationBo.getDetailedPaginated(page, limit);
            const total = await operationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${operations.length} operations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    operations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated operations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};