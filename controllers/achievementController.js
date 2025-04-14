const AchievementBo = require('../models/bos/achievementBo');
const AchievementDo = require('../models/dos/achievementDo');
const AchievementDto = require('../models/dtos/achievementDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const achievementBo = new AchievementBo();

module.exports = {
    async createAchievement(req, res)
    {
        let achievementDo = new AchievementDo();

        achievementDo.name = req.body.name;

        /*
        let achievementDo = new achievementDo(req.body); //?
        */

        try {
            const result = await achievementBo.create(achievementDo);

            if ( result )
            {
                const achievementId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Achievement created successfully: ID ${achievementId}, Name: ${achievementDo.name}`);
                return res.redirect('/achievement/create');
            }
            else
            {
                LogHelper.addError('Cannot create Achievement');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('achievementCreateView', {
                    title: 'Create Achievement',
                    message: 'Achievement creation failed. Please try again.',
                    pageStyles: ['create', 'achievementCreate'],
                    pageScripts: ['achievementCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Achievement: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('achievementCreateView', {
            title: 'Create Achievement',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'achievementCreate'],
            pageScripts: ['achievementCreate'],
        });
    },

    async updateAchievement(req, res)
    {
        let achievementDo = new AchievementDo();

        achievementDo.id = parseInt(req.params.id);
        achievementDo.userId = parseInt(req.body.user_id);
        achievementDo.categoryId = parseInt(req.body.category_id);
        achievementDo.title = req.body.title;
        achievementDo.description = req.body.description;
        achievementDo.value = req.body.value;
        achievementDo.dateAwarded = req.body.date_awarded;
        achievementDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await achievementBo.update(achievementDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Achievement updated successfully: ID ${achievementDo.id}, Title: ${achievementDo.title}`);
                return res.redirect(`/achievement/update/${achievementDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Achievement: ID ${achievementDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('achievementUpdateView', {
                    title: 'Update Achievement',
                    message: 'Achievement update failed. Achievement not found.',
                    pageStyles: ['update', 'achievementUpdate'],
                    pageScripts: ['achievementUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Achievement: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('achievementUpdateView', {
                title: 'Update Achievement',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'achievementUpdate'],
                pageScripts: ['achievementUpdate'],
            });
        }
    },

    async deleteAchievement(req, res)
    {
        const achievementId = parseInt(req.params.id);
    
        try {
            const result = await achievementBo.deleteById(achievementId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Achievement deleted successfully: ID ${achievementId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Achievement deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Achievement: ID ${achievementId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Achievement not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Achievement: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAchievementById(req, res)
    {
        const achievementId = parseInt(req.params.id);

        try {
            const achievement = await achievementBo.getById(achievementId);
    
            if ( !achievement )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Achievement not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievement,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching achievement: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the achievement.',
            });
        }
    },

    async getAchievementList(req, res)
    {
        try {
            const achievements = await achievementBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievements,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching achievement list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the achievement list.',
            });
        }
    },

    async getPaginatedAchievementList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const achievements = await achievementBo.getPaginated(page, limit);
            const total = await achievementBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${achievements.length} achievements (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    achievements,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated achievements: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAchievementById(req, res)
    {
        const achievementId = parseInt(req.params.id);

        try {
            const achievement = await achievementBo.getDetailedById(achievementId);
    
            if ( !achievement )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Achievement not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievement,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed achievement: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed achievement.',
            });
        }
    },

    async getDetailedAchievementList(req, res)
    {
        try {
            const achievements = await achievementBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: achievements,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed achievement list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed achievement list.',
            });
        }
    },

    async getDetailedPaginatedAchievementList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const achievements = await achievementBo.getDetailedPaginated(page, limit);
            const total = await achievementBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${achievements.length} achievements (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    achievements,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated achievements: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};