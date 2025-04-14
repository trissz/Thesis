const MultimediaCategoryBo = require('../models/bos/multimediaCategoryBo');
const MultimediaCategoryDo = require('../models/dos/multimediaCategoryDo');
const MultimediaCategoryDto = require('../models/dtos/multimediaCategoryDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const multimediaCategoryBo = new MultimediaCategoryBo();

module.exports = {
    async createMultimediaCategory(req, res)
    {
        let multimediaCategoryDo = new MultimediaCategoryDo();

        multimediaCategoryDo.name = req.body.name;

        /*
        let multimediaCategoryDo = new MultimediaCategoryDo(req.body); //?
        */

        try {
            const result = await multimediaCategoryBo.create(multimediaCategoryDo);

            if ( result )
            {
                const multimediaCategoryId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Multimedia category created successfully: ID ${multimediaCategoryId}, Name: ${multimediaCategoryDo.name}`);
                return res.redirect('/multimedia-category/create');
            }
            else
            {
                LogHelper.addError('Cannot create multimedia category');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('userCreateView', {
                    title: 'Create Multimedia category',
                    message: 'Multimedia category creation failed. Please try again.',
                    pageStyles: ['create', 'multimediaCategoryCreate'],
                    pageScripts: ['multimediaCategoryCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating multimedia category: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('multimediaCategoryCreateView', {
                    title: 'Create Multimedia category',
                    message: 'Multimedia category name is already in use. Please try a different one.',
                    pageStyles: ['create', 'multimediaCategoryCreate'],
                    pageScripts: ['multimediaCategoryCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('multimediaCategoryCreateView', {
            title: 'Create Multimedia category',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'multimediaCategoryCreate'],
            pageScripts: ['multimediaCategoryCreate'],
        });
    },

    async updateMultimediaCategory(req, res)
    {
        let multimediaCategoryDo = new MultimediaCategoryDo();

        multimediaCategoryDo.id = parseInt(req.params.id);
        multimediaCategoryDo.name = req.body.name;
        multimediaCategoryDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await multimediaCategoryBo.update(multimediaCategoryDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Multimedia category updated successfully: ID ${multimediaCategoryDo.id}, Name: ${multimediaCategoryDo.name}`);
                return res.redirect(`/multimedia-category/update/${multimediaCategoryDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Multimedia category: ID ${multimediaCategoryDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('multimediaCategoryUpdateView', {
                    title: 'Update Multimedia category',
                    message: 'Multimedia category update failed. Multimedia category not found.',
                    pageStyles: ['update', 'multimediaCategoryUpdate'],
                    pageScripts: ['multimediaCategoryUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Multimedia category: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('multimediaCategoryUpdateView', {
                title: 'Update Multimedia category',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'multimediaCategoryUpdate'],
                pageScripts: ['multimediaCategoryUpdate'],
            });
        }
    },

    async deleteMultimediaCategory(req, res)
    {
        const multimediaCategoryId = parseInt(req.params.id);
    
        try {
            const result = await multimediaCategoryBo.deleteById(multimediaCategoryId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Multimedia category deleted successfully: ID ${multimediaCategoryId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Multimedia category deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Multimedia category: ID ${multimediaCategoryId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Multimedia category not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Multimedia category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getMultimediaCategoryById(req, res)
    {
        const multimediaCategoryId = parseInt(req.params.id);

        try {
            const multimediaCategory = await multimediaCategoryBo.getById(multimediaCategoryId);
    
            if ( !multimediaCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Multimedia category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: multimediaCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching multimedia category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the multimedia category.',
            });
        }
    },

    async getMultimediaCategoryList(req, res)
    {
        try {
            const multimediaCategories = await multimediaCategoryBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: multimediaCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching multimedia category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the multimedia category list.',
            });
        }
    },

    async getPaginatedMultimediaCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const multimediaCategories = await multimediaCategoryBo.getPaginated(page, limit);
            const total = await multimediaCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${multimediaCategories.length} multimedia categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    multimediaCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated multimedia categories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedMultimediaCategoryById(req, res)
    {
        const multimediaCategoryId = parseInt(req.params.id);

        try {
            const multimediaCategory = await multimediaCategoryBo.getDetailedById(multimediaCategoryId);
    
            if ( !multimediaCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Multimedia category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: multimediaCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed multimedia category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed multimedia category.',
            });
        }
    },

    async getDetailedMultimediaCategoryList(req, res)
    {
        try {
            const multimediaCategories = await multimediaCategoryBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: multimediaCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed multimedia category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed multimedia category list.',
            });
        }
    },

    async getDetailedPaginatedMultimediaCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const multimediaCategories = await multimediaCategoryBo.getDetailedPaginated(page, limit);
            const total = await multimediaCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${multimediaCategories.length} multimedia categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    multimediaCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated multimediaCategories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};