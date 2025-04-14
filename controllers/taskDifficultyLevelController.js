const TaskDifficultyLevelBo = require('../models/bos/taskDifficultyLevelBo');
const TaskDifficultyLevelDo = require('../models/dos/taskDifficultyLevelDo');
const TaskDifficultyLevelDto = require('../models/dtos/taskDifficultyLevelDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const taskDifficultyLevelBo = new TaskDifficultyLevelBo();

module.exports = {
    async createTaskDifficultyLevel(req, res)
    {
        let taskDifficultyLevelDo = new TaskDifficultyLevelDo();

        taskDifficultyLevelDo.name = req.body.name;
        taskDifficultyLevelDo.description = req.body.description;

        /*
        let taskDifficultyLevelDo = new taskDifficultyLevelDo(req.body); //?
        */

        try {
            const result = await taskDifficultyLevelBo.create(taskDifficultyLevelDo);

            if ( result )
            {
                const taskDifficultyLevelId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Task difficulty level created successfully: ID ${taskDifficultyLevelId}, Name: ${taskDifficultyLevelDo.name}`);
                return res.redirect('/task-difficulty-level/create');
            }
            else
            {
                LogHelper.addError('Cannot create Task difficulty level');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('taskDifficultyLevelCreateView', {
                    title: 'Create Task difficulty level',
                    message: 'Task difficulty level creation failed. Please try again.',
                    pageStyles: ['create', 'taskDifficultyLevelCreate'],
                    pageScripts: ['taskDifficultyLevelCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Task difficulty level: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('taskDifficultyLevelCreateView', {
                    title: 'Create Task difficulty level',
                    message: 'Task difficulty level name is already in use. Please try a different one.',
                    pageStyles: ['create', 'taskDifficultyLevelCreate'],
                    pageScripts: ['taskDifficultyLevelCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskDifficultyLevelCreateView', {
            title: 'Create Task difficulty level',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskDifficultyLevelCreate'],
            pageScripts: ['taskDifficultyLevelCreate'],
        });
    },

    async updateTaskDifficultyLevel(req, res)
    {
        let taskDifficultyLevelDo = new TaskDifficultyLevelDo();

        taskDifficultyLevelDo.id = parseInt(req.params.id);
        taskDifficultyLevelDo.name = req.body.name;
        taskDifficultyLevelDo.description = req.body.description;
        taskDifficultyLevelDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await taskDifficultyLevelBo.update(taskDifficultyLevelDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task difficulty level updated successfully: ID ${taskDifficultyLevelDo.id}, Name: ${taskDifficultyLevelDo.name}`);
                return res.redirect(`/task-difficulty-level/update/${taskDifficultyLevelDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Task difficulty level: ID ${taskDifficultyLevelDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('taskDifficultyLevelUpdateView', {
                    title: 'Update Task difficulty level',
                    message: 'Task difficulty level update failed. Task difficulty level not found.',
                    pageStyles: ['update', 'taskDifficultyLevelUpdate'],
                    pageScripts: ['taskDifficultyLevelUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Task difficulty level: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskDifficultyLevelUpdateView', {
                title: 'Update Task difficulty level',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskDifficultyLevelUpdate'],
                pageScripts: ['taskDifficultyLevelUpdate'],
            });
        }
    },

    async deleteTaskDifficultyLevel(req, res)
    {
        const taskDifficultyLevelId = parseInt(req.params.id);
    
        try {
            const result = await taskDifficultyLevelBo.deleteById(taskDifficultyLevelId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task difficulty level deleted successfully: ID ${taskDifficultyLevelId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Task difficulty level deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Task difficulty level: ID ${taskDifficultyLevelId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Task difficulty level not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Task difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getTaskDifficultyLevelById(req, res)
    {
        const taskDifficultyLevelId = parseInt(req.params.id);

        try {
            const taskDifficultyLevel = await taskDifficultyLevelBo.getById(taskDifficultyLevelId);
    
            if ( !taskDifficultyLevel )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task difficulty level not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskDifficultyLevel,
            });
        } catch (error) {
            LogHelper.addError(`Error fetching task difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task difficulty level.',
            });
        }
    },

    async getTaskDifficultyLevelList(req, res)
    {
        try {
            const taskDifficultyLevels = await taskDifficultyLevelBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskDifficultyLevels,
            });
        } catch (error) {
            LogHelper.addError(`Error fetching task difficulty level list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task difficulty level list.',
            });
        }
    },

    async getPaginatedTaskDifficultyLevelList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const taskDifficultyLevels = await taskDifficultyLevelBo.getPaginated(page, limit);
            const total = await taskDifficultyLevelBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${taskDifficultyLevels.length} task difficulty levels (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    taskDifficultyLevels,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch (error) {
            LogHelper.addError(`Error fetching paginated task difficulty levels: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedTaskDifficultyLevelById(req, res)
    {
        const taskDifficultyLevelId = parseInt(req.params.id);

        try {
            const taskDifficultyLevel = await taskDifficultyLevelBo.getDetailedById(taskDifficultyLevelId);
    
            if ( !taskDifficultyLevel )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task difficulty level not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskDifficultyLevel,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task difficulty level.',
            });
        }
    },

    async getDetailedTaskDifficultyLevelList(req, res)
    {
        try {
            const taskDifficultyLevels = await taskDifficultyLevelBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskDifficultyLevels,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task difficulty level list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task difficulty level list.',
            });
        }
    },

    async getDetailedPaginatedTaskDifficultyLevelList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const taskDifficultyLevels = await taskDifficultyLevelBo.getDetailedPaginated(page, limit);
            const total = await taskDifficultyLevelBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${taskDifficultyLevels.length} task difficulty levels (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    taskDifficultyLevels,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated task difficulty levels: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};