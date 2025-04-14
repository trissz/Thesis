const FeedbackBo = require('../models/bos/feedbackBo');
const FeedbackDo = require('../models/dos/feedbackDo');
const FeedbackDto = require('../models/dtos/feedbackDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const feedbackBo = new FeedbackBo();

module.exports = {
    async createFeedback(req, res)
    {
        let feedbackDo = new FeedbackDo();

        feedbackDo.userId = req.cookies.userId || req.session.userId;
        feedbackDo.topic = req.body.topic;
        feedbackDo.content = req.body.content;

        /*
        let feedbackDo = new feedbackDo(req.body); //?
        */

        try {
            const result = await feedbackBo.create(feedbackDo);

            if ( result )
            {
                const feedbackId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Feedback created successfully: ID ${feedbackId}`);
                return res.redirect('/feedback/create');
            }
            else
            {
                LogHelper.addError('Cannot create Feedback');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('feedbackCreateView', {
                    title: 'Create Feedback',
                    message: 'Feedback creation failed. Please try again.',
                    pageStyles: ['create', 'feedbackCreate'],
                    pageScripts: ['feedbackCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Feedback: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('feedbackCreateView', {
            title: 'Create Feedback',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'feedbackCreate'],
            pageScripts: ['feedbackCreate'],
        });
    },

    async updateFeedback(req, res)
    {
        let feedbackDo = new FeedbackDo();

        feedbackDo.id = parseInt(req.params.id);
        feedbackDo.userId = parseInt(req.body.user_id);
        feedbackDo.topic = req.body.topic;
        feedbackDo.content = req.body.content;
        feedbackDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await feedbackBo.update(feedbackDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Feedback updated successfully: ID ${feedbackDo.id}`);
                return res.redirect(`/feedback/update/${feedbackDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Feedback: ID ${feedbackDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('feedbackUpdateView', {
                    title: 'Update Feedback',
                    message: 'Feedback update failed. Feedback not found.',
                    pageStyles: ['update', 'feedbackUpdate'],
                    pageScripts: ['feedbackUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Feedback: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('feedbackUpdateView', {
                title: 'Update Feedback',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'feedbackUpdate'],
                pageScripts: ['feedbackUpdate'],
            });
        }
    },

    async deleteFeedback(req, res)
    {
        const feedbackId = parseInt(req.params.id);
    
        try {
            const result = await feedbackBo.deleteById(feedbackId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Feedback deleted successfully: ID ${feedbackId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Feedback deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Feedback: ID ${feedbackId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Feedback not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Feedback: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getFeedbackById(req, res)
    {
        const feedbackId = parseInt(req.params.id);

        try {
            const feedback = await feedbackBo.getById(feedbackId);
    
            if ( !feedback )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Feedback not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: feedback,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching feedback: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the feedback.',
            });
        }
    },

    async getFeedbackList(req, res)
    {
        try {
            const feedbackList = await feedbackBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: feedbackList,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching feedback list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the feedback list.',
            });
        }
    },

    async getPaginatedFeedbackList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const feedbackList = await feedbackBo.getPaginated(page, limit);
            const total = await feedbackBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${feedbackList.length} feedback (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    feedbackList,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated feedback: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedFeedbackById(req, res)
    {
        const feedbackId = parseInt(req.params.id);

        try {
            const feedback = await feedbackBo.getDetailedById(feedbackId);
    
            if ( !feedback )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Feedback not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: feedback,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed feedback: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed feedback.',
            });
        }
    },

    async getDetailedFeedbackList(req, res)
    {
        try {
            const feedback = await feedbackBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: feedback,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed feedback list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed feedback list.',
            });
        }
    },

    async getDetailedPaginatedFeedbackList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const feedback = await feedbackBo.getDetailedPaginated(page, limit);
            const total = await feedbackBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${feedback.length} feedback (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    feedback,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated feedback: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};