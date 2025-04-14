const LessonBo = require('../models/bos/lessonBo');
const LessonDo = require('../models/dos/lessonDo');
const LessonDto = require('../models/dtos/lessonDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const lessonBo = new LessonBo();

module.exports = {
    async createLesson(req, res)
    {
        let lessonDo = new LessonDo();

        lessonDo.moduleId = parseInt(req.body.module_id);
        lessonDo.timeUnitId = parseInt(req.body.time_unit_id);
        lessonDo.title = req.body.title;
        lessonDo.content = req.body.content;
        lessonDo.estimatedTimeValue = parseInt(req.body.estimated_time_value);

        /*
        let lessonDo = new lessonDo(req.body); //?
        */

        try {
            const result = await lessonBo.create(lessonDo);

            if ( result )
            {
                const lessonId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Lesson created successfully: ID ${lessonId}`);
                return res.redirect('/lesson/create');
            }
            else
            {
                LogHelper.addError('Cannot create Lesson');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('lessonCreateView', {
                    title: 'Create Lesson',
                    message: 'Lesson creation failed. Please try again.',
                    pageStyles: ['create', 'lessonCreate'],
                    pageScripts: ['lessonCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Lesson: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('lessonCreateView', {
            title: 'Create Lesson',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'lessonCreate'],
            pageScripts: ['lessonCreate'],
        });
    },

    async updateLesson(req, res)
    {
        let lessonDo = new LessonDo();

        lessonDo.id = parseInt(req.params.id);
        lessonDo.moduleId = parseInt(req.body.module_id);
        lessonDo.timeUnitId = parseInt(req.body.time_unit_id);
        lessonDo.title = req.body.title;
        lessonDo.content = req.body.content;
        lessonDo.estimatedTtimeValue = parseInt(req.body.estimated_time_value);
        lessonDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await lessonBo.update(lessonDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Lesson updated successfully: ID ${lessonDo.id}, Title: ${lessonDo.title}`);
                return res.redirect(`/lesson/update/${lessonDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Lesson: ID ${lessonDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('lessonUpdateView', {
                    title: 'Update Lesson',
                    message: 'Lesson update failed. Lesson not found.',
                    pageStyles: ['update', 'lessonUpdate'],
                    pageScripts: ['lessonUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Lesson: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('lessonUpdateView', {
                title: 'Update Lesson',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'lessonUpdate'],
                pageScripts: ['lessonUpdate'],
            });
        }
    },

    async deleteLesson(req, res)
    {
        const lessonId = parseInt(req.params.id);
    
        try {
            const result = await lessonBo.deleteById(lessonId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Lesson deleted successfully: ID ${lessonId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Lesson deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Lesson: ID ${lessonId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Lesson not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Lesson: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getLessonById(req, res)
    {
        const lessonId = parseInt(req.params.id);

        try {
            const lesson = await lessonBo.getById(lessonId);
    
            if ( !lesson )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Lesson not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lesson,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching lesson: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the lesson.',
            });
        }
    },

    async getLessonListByModuleId(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const lessons = await lessonBo.getAllByModuleId(moduleId);

            console.log(lessons);
    
            if ( !lessons )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: `No lessons found for module with ID ${moduleId}.`,
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lessons,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching lessons: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: `An unexpected error occurred while fetching the lessons for module with ID ${moduleId}`,
            });
        }
    },

    async getLessonList(req, res)
    {
        try {
            const lessons = await lessonBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lessons,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching lesson list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the lesson list.',
            });
        }
    },

    async getPaginatedLessonList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const lessons = await lessonBo.getPaginated(page, limit);
            const total = await lessonBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${lessons.length} lessons (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    lessons,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated lessons: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedLessonById(req, res)
    {
        const lessonId = parseInt(req.params.id);

        try {
            const lesson = await lessonBo.getDetailedById(lessonId);
    
            if ( !lesson )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Lesson not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lesson,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed lesson: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed lesson.',
            });
        }
    },

    async getDetailedLessonListByModuleId(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const lessons = await lessonBo.getDetailedAllByModuleId(moduleId);
    
            if ( !lessons )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: `No detailed lessons found for module with ID ${moduleId}.`,
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lessons,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed lessons: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: `An unexpected error occurred while fetching the detailed lessons for module with ID ${moduleId}`,
            });
        }
    },

    async getDetailedLessonList(req, res)
    {
        try {
            const lessons = await lessonBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: lessons,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed lesson list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed lesson list.',
            });
        }
    },

    async getDetailedPaginatedLessonList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const lessons = await lessonBo.getDetailedPaginated(page, limit);
            const total = await lessonBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${lessons.length} lessons (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    lessons,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated lessons: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};