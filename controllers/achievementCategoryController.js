const AchievementCategoryBo = require('../models/bos/achievementCategoryBo');
const AchievementCategoryDo = require('../models/dos/achievementCategoryDo');
const AchievementCategoryDto = require('../models/dtos/achievementCategoryDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const achievementCategoryBo = new AchievementCategoryBo();

module.exports = {
    async createAchievementCategory(req, res)
    {
        let achievementCategoryDo = new AchievementCategoryDo();

        achievementCategoryDo.name = req.body.name;

        /*
        let achievementCategoryDo = new achievementCategoryDo(req.body); //?
        */

        try {
            const result = await achievementCategoryBo.create(achievementCategoryDo);

            if ( result )
            {
                const achievementCategoryId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Achievement category created successfully: ID ${achievementCategoryId}, Name: ${achievementCategoryDo.name}`);
                return res.redirect('/achievement-category/create');
            }
            else
            {
                LogHelper.addError('Cannot create Achievement category');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('achievementCategoryCreateView', {
                    title: 'Create Achievement category',
                    message: 'Achievement category creation failed. Please try again.',
                    pageStyles: ['create', 'achievementCategoryCreate'],
                    pageScripts: ['achievementCategoryCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Achievement category: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('achievementCategoryCreateView', {
                    title: 'Create Achievement category',
                    message: 'Achievement category name is already in use. Please try a different one.',
                    pageStyles: ['create', 'achievementCategoryCreate'],
                    pageScripts: ['achievementCategoryCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('achievementCategoryCreateView', {
            title: 'Create Achievement category',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'achievementCategoryCreate'],
            pageScripts: ['achievementCategoryCreate'],
        });
    },

    async updateAchievementCategory(req, res)
    {
        let achievementCategoryDo = new AchievementCategoryDo();

        achievementCategoryDo.id = parseInt(req.params.id);
        achievementCategoryDo.name = req.body.name;
        achievementCategoryDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await achievementCategoryBo.update(achievementCategoryDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Achievement category updated successfully: ID ${achievementCategoryDo.id}, Name: ${achievementCategoryDo.name}`);
                return res.redirect(`/achievement-category/update/${achievementCategoryDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Achievement category: ID ${achievementCategoryDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('achievementCategoryUpdateView', {
                    title: 'Update Achievement category',
                    message: 'Achievement category update failed. Achievement category not found.',
                    pageStyles: ['update', 'achievementCategoryUpdate'],
                    pageScripts: ['achievementCategoryUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Achievement category: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('achievementCategoryUpdateView', {
                title: 'Update Achievement category',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'achievementCategoryUpdate'],
                pageScripts: ['achievementCategoryUpdate'],
            });
        }
    },

    async deleteAchievementCategory(req, res)
    {
        const achievementCategoryId = parseInt(req.params.id);
    
        try {
            const result = await achievementCategoryBo.deleteById(achievementCategoryId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Achievement category deleted successfully: ID ${achievementCategoryId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Achievement category deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Achievement category: ID ${achievementCategoryId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Achievement category not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Achievement category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAchievementCategoryById(req, res)
    {
        const achievementCategoryId = parseInt(req.params.id);

        try {
            const achievementCategory = await achievementCategoryBo.getById(achievementCategoryId);
                
            if ( !achievementCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Achievement category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievementCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching achievement category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the achievement category.',
            });
        }
    },

    async getAchievementCategoryList(req, res)
    {
        try {
            const achievementCategories = await achievementCategoryBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievementCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching achievement category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the achievement category list.',
            });
        }
    },

    async getPaginatedAchievementCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const achievementCategories = await achievementCategoryBo.getPaginated(page, limit);
            const total = await achievementCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${achievementCategories.length} achievement categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    achievementCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated achievement categories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAchievementCategoryById(req, res)
    {
        const achievementCategoryId = parseInt(req.params.id);

        try {
            const achievementCategory = await achievementCategoryBo.getDetailedById(achievementCategoryId);
    
            if ( !achievementCategory )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Achievement category not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievementCategory,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed achievement category: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed achievement category.',
            });
        }
    },

    async getDetailedAchievementCategoryList(req, res)
    {
        try {
            const achievementCategories = await achievementCategoryBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievementCategories,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed achievement category list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed achievement category list.',
            });
        }
    },

    async getDetailedPaginatedAchievementCategoryList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const achievementCategories = await achievementCategoryBo.getDetailedPaginated(page, limit);
            const total = await achievementCategoryBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${achievementCategories.length} achievement categories (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    achievementCategories,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated achievement categories: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};