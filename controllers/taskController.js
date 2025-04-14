const TaskBo = require('../models/bos/taskBo');
const TaskDo = require('../models/dos/taskDo');
const TaskDto = require('../models/dtos/taskDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const taskBo = new TaskBo();

module.exports = {
    async createTask(req, res)
    {
        let taskDo = new TaskDo();

        taskDo.typeId = parseInt(req.body.type_id);
        taskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        taskDo.content = req.body.content;
        taskDo.answer = req.body.answer;
        taskDo.elements = req.body.elements;
        taskDo.hints = req.body.hints;

        /*
        let taskDo = new taskDo(req.body); //?
        */

        try {
            const result = await taskBo.create(taskDo);

            if ( result )
            {
                const taskId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Task created successfully: ID ${taskId}`);
                return res.redirect('/task/create');
            }
            else
            {
                LogHelper.addError('Cannot create Task');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('taskCreateView', {
                    title: 'Create Task',
                    message: 'Task creation failed. Please try again.',
                    pageStyles: ['create', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskCreate'],
                    pageLibraries: [
                        {directory: 'sortable', script: 'sortable.min'}
                    ],
                    pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Task: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskCreateView', {
            title: 'Create Task',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskCreate'],
            pageLibraries: [
                {directory: 'sortable', script: 'sortable.min'}
            ],
            pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskCreate'],
        });
    },

    async updateTask(req, res)
    {
        let taskDo = new TaskDo();

        taskDo.id = parseInt(req.params.id);
        taskDo.typeId = parseInt(req.body.type_id);
        taskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        taskDo.content = req.body.content;
        taskDo.answer = req.body.answer;
        taskDo.elements = req.body.elements;
        taskDo.hints = req.body.hints;
        taskDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await taskBo.update(taskDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task updated successfully: ID ${taskDo.id}`);
                return res.redirect(`/task/update/${taskDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Task: ID ${taskDo.id}`);
                
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('taskUpdateView', {
                    title: 'Update Task',
                    message: 'Task update failed. Task not found.',
                    pageStyles: ['update', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskUpdate'],
                    pageLibraries: [
                        {directory: 'sortable', script: 'sortable.min'}
                    ],
                    pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Task: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskUpdateView', {
                title: 'Update Task',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskHintManager', 'sortableList', 'selectableElements', 'taskConventions', 'taskUpdate'],
                pageLibraries: [
                    {directory: 'sortable', script: 'sortable.min'}
                ],
                pageScripts: ['taskHintManager', 'sortableListHandler', 'selectableElementsHandler', 'inputElementsHandler', 'taskConventions', 'taskUpdate'],
            });
        }
    },

    async deleteTask(req, res)
    {
        const taskId = parseInt(req.params.id);

        try {
            const result = await taskBo.deleteById(taskId);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task deleted successfully: ID ${taskId}`);
                return res.redirect('/task/list');
            }
            else
            {
                LogHelper.addError(`Cannot delete Task: ID ${taskId}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('taskListView', {
                    title: 'Task List',
                    message: 'Task not found or already deleted.',
                    pageStyles: ['taskList'],
                    pageScripts: ['taskList'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Task: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskListView', {
                title: 'Task List',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['taskList'],
                pageScripts: ['taskList'],
            });
        }
    },

    async getTaskById(req, res)
    {
        const taskId = parseInt(req.params.id);

        try {
            const task = await taskBo.getById(taskId);
    
            if ( !task )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: task,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task.',
            });
        }
    },

    async getTaskList(req, res)
    {
        try {
            const tasks = await taskBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: tasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task list.',
            });
        }
    },

    async getPaginatedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const tasks = await taskBo.getPaginated(page, limit);
            const total = await taskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${tasks.length} tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    tasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedTaskById(req, res)
    {
        const taskId = parseInt(req.params.id);

        try {
            const task = await taskBo.getDetailedById(taskId);
    
            if ( !task )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: task,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task.',
            });
        }
    },

    async getDetailedTaskList(req, res)
    {
        try {
            const tasks = await taskBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: tasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task list.',
            });
        }
    },

    async getDetailedPaginatedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const tasks = await taskBo.getDetailedPaginated(page, limit);
            const total = await taskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${tasks.length} tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    tasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async checkTaskSolution(req, res)
    {
        let taskDo = new TaskDo();
        taskDo.id = parseInt(req.params.id);
        taskDo.answer = req.body.answer;
        
        try {
            const isCorrect = await taskBo.checkSolution(taskDo);

            LogHelper.addMessage(`Checked Task solution with ID ${taskDo.id}`);
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