const SortBasedTaskBo = require('../models/bos/sortBasedTaskBo');
const SortBasedTaskDo = require('../models/dos/sortBasedTaskDo');
const SortBasedTaskDto = require('../models/dtos/sortBasedTaskDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const sortBasedTaskBo = new SortBasedTaskBo();

module.exports = {
    async createSortBasedTask(req, res)
    {
        let sortBasedTaskDo = new SortBasedTaskDo();

        sortBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        sortBasedTaskDo.content = req.body.content;
        sortBasedTaskDo.answer = JSON.stringify(JSON.parse(req.body.answer));
        sortBasedTaskDo.elements = JSON.stringify(JSON.parse(req.body.elements));
        sortBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));

        /*
        let sortBasedTaskDo = new sortBasedTaskDo(req.body); //?
        */

        try {
            const result = await sortBasedTaskBo.create(sortBasedTaskDo);

            if ( result )
            {
                const sortBasedTaskId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Sort based task created successfully: ID ${sortBasedTaskId}`);
                return res.redirect('/sort-based-task/create');
            }
            else
            {
                LogHelper.addError('Cannot create Sort based task');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('sortBasedTaskCreateView', {
                    title: 'Create Sort based task',
                    message: 'Sort based task creation failed. Please try again.',
                    pageStyles: ['create', 'taskHintManager', 'sortableList', 'sortBasedTaskCreate'],
                    pageLibraries: [
                        {directory: 'sortable', script: 'sortable.min'}
                    ],
                    pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Sort based task: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('sortBasedTaskCreateView', {
            title: 'Create Sort based task',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskHintManager', 'sortableList', 'sortBasedTaskCreate'],
            pageLibraries: [
                {directory: 'sortable', script: 'sortable.min'}
            ],
            pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskCreate'],
        });
    },

    async updateSortBasedTask(req, res)
    {
        let sortBasedTaskDo = new SortBasedTaskDo();

        sortBasedTaskDo.id = parseInt(req.params.id);
        sortBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        sortBasedTaskDo.content = req.body.content;
        sortBasedTaskDo.answer = JSON.stringify(JSON.parse(req.body.answer));
        sortBasedTaskDo.elements = JSON.stringify(JSON.parse(req.body.elements));
        sortBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));
        sortBasedTaskDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await sortBasedTaskBo.update(sortBasedTaskDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Sort based task updated successfully: ID ${sortBasedTaskDo.id}`);
                return res.redirect(`/sort-based-task/update/${sortBasedTaskDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Sort based task: ID ${sortBasedTaskDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('sortBasedTaskUpdateView', {
                    title: 'Update Sort based task',
                    message: 'Sort based task update failed. Permission not found.',
                    pageStyles: ['update', 'taskHintManager', 'sortableList', 'sortBasedTaskUpdate'],
                    pageLibraries: [
                        {directory: 'sortable', script: 'sortable.min'}
                    ],
                    pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Sort based task: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('sortBasedTaskUpdateView', {
                title: 'Update Sort based task',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskHintManager', 'sortableList', 'sortBasedTaskUpdate'],
                pageLibraries: [
                    {directory: 'sortable', script: 'sortable.min'}
                ],
                pageScripts: ['taskHintManager', 'sortableListHandler', 'sortBasedTaskUpdate'],
            });
        }
    },

    async deleteSortBasedTask(req, res)
    {
        const sortBasedTaskId = parseInt(req.params.id);
    
        try {
            const result = await sortBasedTaskBo.deleteById(sortBasedTaskId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Sort based task deleted successfully: ID ${sortBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Sort based task deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Sort based task: ID ${sortBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Sort based task not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Sort based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getSortBasedTaskById(req, res)
    {
        const sortBasedTaskId = parseInt(req.params.id);

        try {
            const sortBasedTask = await sortBasedTaskBo.getById(sortBasedTaskId);
    
            if ( !sortBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Sort based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: sortBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching sort based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the sort based task.',
            });
        }
    },

    async getSortBasedTaskList(req, res)
    {
        try {
            const sortBasedTasks = await sortBasedTaskBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: sortBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching sort based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the sort based task list.',
            });
        }
    },

    async getPaginatedSortBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const sortBasedTasks = await sortBasedTaskBo.getPaginated(page, limit);
            const total = await sortBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${sortBasedTasks.length} sort based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    sortBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated sort based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedSortBasedTaskById(req, res)
    {
        const sortBasedTaskId = parseInt(req.params.id);

        try {
            const sortBasedTask = await sortBasedTaskBo.getDetailedById(sortBasedTaskId);
    
            if ( !sortBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Sort based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: sortBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed sort based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed sort based task.',
            });
        }
    },

    async getDetailedSortBasedTaskList(req, res)
    {
        try {
            const sortBasedTasks = await sortBasedTaskBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: sortBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed sort based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed sort based task list.',
            });
        }
    },

    async getDetailedPaginatedSortBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const sortBasedTasks = await sortBasedTaskBo.getDetailedPaginated(page, limit);
            const total = await sortBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${sortBasedTasks.length} sort based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    sortBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated sort based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async checkSortBasedTaskSolution(req, res)
    {
        let sortBasedTaskDo = new SortBasedTaskDo();
        sortBasedTaskDo.id = parseInt(req.params.id);
        sortBasedTaskDo.answer = req.body.answer;
        
        try {
            const isCorrect = await sortBasedTaskBo.checkSolution(sortBasedTaskDo);

            LogHelper.addMessage(`Checked Sort based task solution with ID ${sortBasedTaskDo.id}`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                isSolutionCorrect: isCorrect,
            });
        } catch ( error ) {
            LogHelper.addError(`Error checking task solution: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An unexpected error occurred.',
            });
        }
    },
};