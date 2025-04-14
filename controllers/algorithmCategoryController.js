const AlgorithmCategoryBo = require('../models/bos/algorithmCategoryBo');
const AlgorithmCategoryDo = require('../models/dos/algorithmCategoryDo');
const AlgorithmCategoryDto = require('../models/dtos/algorithmCategoryDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const algorithmCategoryBo = new AlgorithmCategoryBo();

module.exports = {
    async createAlgorithmCategory(req, res)
    {
        let algorithmCategoryDo = new AlgorithmCategoryDo();

        algorithmCategoryDo.name = req.body.name;

        /*
        let algorithmCategoryDo = new algorithmCategoryDo(req.body); //?
        */

        try {
            const result = await algorithmCategoryBo.create(algorithmCategoryDo);

            if ( result )
            {
                const algorithmCategoryId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Algorithm category created successfully: ID ${algorithmCategoryId}, Name: ${algorithmCategoryDo.name}`);
                return res.redirect('/algorithm-category/create');
            }
            else
            {
                LogHelper.addError('Cannot create Algorithm category');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('algorithmCategoryCreateView', {
                    title: 'Create Algorithm category',
                    message: 'Algorithm category creation failed. Please try again.',
                    pageStyles: ['create', 'algorithmCategoryCreate'],
                    pageScripts: ['algorithmCategoryCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Algorithm category: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('algorithmCategoryCreateView', {
                    title: 'Create Algorithm category',
                    message: 'Algorithm category name is already in use. Please try a different one.',
                    pageStyles: ['create', 'algorithmCategoryCreate'],
                    pageScripts: ['algorithmCategoryCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmCategoryCreateView', {
            title: 'Create Algorithm category',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'algorithmCategoryCreate'],
            pageScripts: ['algorithmCategoryCreate'],
        });
    },

    async updateAlgorithmCategory(req, res)
    {
        let algorithmCategoryDo = new AlgorithmCategoryDo();

        algorithmCategoryDo.id = parseInt(req.params.id);
        algorithmCategoryDo.name = req.body.name;
        algorithmCategoryDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await algorithmCategoryBo.update(algorithmCategoryDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm category updated successfully: ID ${algorithmCategoryDo.id}, Name: ${algorithmCategoryDo.name}`);
                return res.redirect(`/algorithm-category/update/${algorithmCategoryDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Algorithm category: ID ${algorithmCategoryDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('algorithmCategoryUpdateView', {
                    title: 'Update Algorithm category',
                    message: 'Algorithm category update failed. Algorithm category not found.',
                    pageStyles: ['update', 'algorithmCategoryUpdate'],
                    pageScripts: ['algorithmCategoryUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Algorithm category: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmCategoryUpdateView', {
                title: 'Update Algorithm category',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'algorithmCategoryUpdate'],
                pageScripts: ['algorithmCategoryUpdate'],
            });
        }
    },

    async deleteAlgorithmCategory(req, res)
    {
        const algorithmCategoryId = parseInt(req.params.id);
    
        try {
            const result = await algorithmCategoryBo.deleteById(algorithmCategoryId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm category deleted successfully: ID ${algorithmCategoryId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Algorithm category deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Algorithm category: ID ${algorithmCategoryId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Algorithm category not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Algorithm category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAlgorithmCategoryById(req, res)
    {
        const algorithmCategoryId = parseInt(req.params.id);

        try {
            const algorithmCategory = await algorithmCategoryBo.getById(algorithmCategoryId);
    
            if ( !algorithmCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm category.',
            });
        }
    },

    async getAlgorithmCategoryList(req, res)
    {
        try {
            const algorithmCategories = await algorithmCategoryBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm category list.',
            });
        }
    },

    async getPaginatedAlgorithmCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmCategories = await algorithmCategoryBo.getPaginated(page, limit);
            const total = await algorithmCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmCategories.length} algorithm categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated algorithm categories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAlgorithmCategoryById(req, res)
    {
        const algorithmCategoryId = parseInt(req.params.id);

        try {
            const algorithmCategory = await algorithmCategoryBo.getDetailedById(algorithmCategoryId);
    
            if ( !algorithmCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm category.',
            });
        }
    },

    async getDetailedAlgorithmCategoryList(req, res)
    {
        try {
            const algorithmCategories = await algorithmCategoryBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm category list.',
            });
        }
    },

    async getDetailedPaginatedAlgorithmCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmCategories = await algorithmCategoryBo.getDetailedPaginated(page, limit);
            const total = await algorithmCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmCategories.length} algorithm categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated algorithm categories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};