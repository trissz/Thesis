const SelectBasedTaskBo = require('../models/bos/selectBasedTaskBo');
const SelectBasedTaskDo = require('../models/dos/selectBasedTaskDo');
const SelectBasedTaskDto = require('../models/dtos/selectBasedTaskDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const selectBasedTaskBo = new SelectBasedTaskBo();

module.exports = {
    async createSelectBasedTask(req, res)
    {
        let selectBasedTaskDo = new SelectBasedTaskDo();

        selectBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        selectBasedTaskDo.content = req.body.content;
        selectBasedTaskDo.answer = JSON.stringify(JSON.parse(req.body.answer));
        selectBasedTaskDo.options = JSON.stringify(JSON.parse(req.body.options));
        selectBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));

        /*
        let selectBasedTaskDo = new selectBasedTaskDo(req.body); //?
        */

        try {
            const result = await selectBasedTaskBo.create(selectBasedTaskDo);

            if ( result )
            {
                const selectBasedTaskId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Select based task created successfully: ID ${selectBasedTaskId}`);
                return res.redirect('/select-based-task/create');
            }
            else
            {
                LogHelper.addError('Cannot create Select based task');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('selectBasedTaskCreateView', {
                    title: 'Create Select based task',
                    message: 'Select based task creation failed. Please try again.',
                    pageStyles: ['create', 'taskHintManager', 'selectableElements', 'selectBasedTaskCreate'],
                    pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Select based task: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('selectBasedTaskCreateView', {
            title: 'Create Select based task',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskHintManager', 'selectableElements', 'selectBasedTaskCreate'],
            pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskCreate'],
        });
    },

    async updateSelectBasedTask(req, res)
    {
        let selectBasedTaskDo = new SelectBasedTaskDo();

        selectBasedTaskDo.id = parseInt(req.params.id);
        selectBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        selectBasedTaskDo.content = req.body.content;
        selectBasedTaskDo.answer = JSON.stringify(JSON.parse(req.body.answer));
        selectBasedTaskDo.options = JSON.stringify(JSON.parse(req.body.options));
        selectBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));
        selectBasedTaskDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await selectBasedTaskBo.update(selectBasedTaskDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Select based task updated successfully: ID ${selectBasedTaskDo.id}`);
                return res.redirect(`/select-based-task/update/${selectBasedTaskDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Select based task: ID ${selectBasedTaskDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('selectBasedTaskUpdateView', {
                    title: 'Update Select based task',
                    message: 'Select based task update failed. Select based task not found.',
                    pageStyles: ['update', 'taskHintManager', 'selectableElements', 'selectBasedTaskUpdate'],
                    pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Select based task: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('selectBasedTaskUpdateView', {
                title: 'Update Select based task',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskHintManager', 'selectableElements', 'selectBasedTaskUpdate'],
                pageScripts: ['taskHintManager', 'selectableElementsHandler', 'selectBasedTaskUpdate'],
            });
        }
    },

    async deleteSelectBasedTask(req, res)
    {
        const selectBasedTaskId = parseInt(req.params.id);
    
        try {
            const result = await selectBasedTaskBo.deleteById(selectBasedTaskId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Select based task deleted successfully: ID ${selectBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Select based task deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Select based task: ID ${selectBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Select based task not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Select based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getSelectBasedTaskById(req, res)
    {
        const selectBasedTaskId = parseInt(req.params.id);

        try {
            const selectBasedTask = await selectBasedTaskBo.getById(selectBasedTaskId);
    
            if ( !selectBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Select based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: selectBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching select based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the select based task.',
            });
        }
    },

    async getSelectBasedTaskList(req, res)
    {
        try {
            const selectBasedTasks = await selectBasedTaskBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: selectBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching select based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the select based task list.',
            });
        }
    },

    async getPaginatedSelectBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const selectBasedTasks = await selectBasedTaskBo.getPaginated(page, limit);
            const total = await selectBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${selectBasedTasks.length} select based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    selectBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated select based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedSelectBasedTaskById(req, res)
    {
        const selectBasedTaskId = parseInt(req.params.id);

        try {
            const selectBasedTask = await selectBasedTaskBo.getDetailedById(selectBasedTaskId);
    
            if ( !selectBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Select based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: selectBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed select based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed select based task.',
            });
        }
    },

    async getDetailedSelectBasedTaskList(req, res)
    {
        try {
            const selectBasedTasks = await selectBasedTaskBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: selectBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed select based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed select based task list.',
            });
        }
    },

    async getDetailedPaginatedSelectBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const selectBasedTasks = await selectBasedTaskBo.getDetailedPaginated(page, limit);
            const total = await selectBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${selectBasedTasks.length} select based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    selectBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated select based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async checkSelectBasedTaskSolution(req, res)
    {
        let selectBasedTaskDo = new SelectBasedTaskDo();
        selectBasedTaskDo.id = parseInt(req.params.id);
        selectBasedTaskDo.answer = req.body.answer;
        
        try {
            const isCorrect = await selectBasedTaskBo.checkSolution(selectBasedTaskDo);

            LogHelper.addMessage(`Checked Select based task solution with ID ${selectBasedTaskDo.id}`);
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