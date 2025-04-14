const InputBasedTaskBo = require('../models/bos/inputBasedTaskBo');
const InputBasedTaskDo = require('../models/dos/inputBasedTaskDo');
const InputBasedTaskDto = require('../models/dtos/inputBasedTaskDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const inputBasedTaskBo = new InputBasedTaskBo();

module.exports = {
    async createInputBasedTask(req, res)
    {
        let inputBasedTaskDo = new InputBasedTaskDo();

        inputBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        inputBasedTaskDo.content = req.body.content;
        inputBasedTaskDo.answer = req.body.answer;
        inputBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));

        /*
        let inputBasedTaskDo = new inputBasedTaskDo(req.body); //?
        */

        try {
            const result = await inputBasedTaskBo.create(inputBasedTaskDo);

            if ( result )
            {
                const inputBasedTaskId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Input based task created successfully: ID ${inputBasedTaskId}`);
                return res.redirect('/input-based-task/create');
            }
            else
            {
                LogHelper.addError('Cannot create Input based task');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('inputBasedTaskCreateView', {
                    title: 'Create Input based task',
                    message: 'Input based task creation failed. Please try again.',
                    pageStyles: ['create', 'taskHintManager', 'inputBasedTaskCreate'],
                    pageScripts: ['taskHintManager', 'inputBasedTaskCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Input based task: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('inputBasedTaskCreateView', {
            title: 'Create Input based task',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskHintManager', 'inputBasedTaskCreate'],
            pageScripts: ['taskHintManager', 'inputBasedTaskCreate'],
        });
    },

    async updateInputBasedTask(req, res)
    {
        let inputBasedTaskDo = new InputBasedTaskDo();

        inputBasedTaskDo.id = parseInt(req.params.id);
        inputBasedTaskDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        inputBasedTaskDo.content = req.body.content;
        inputBasedTaskDo.answer = req.body.answer;
        inputBasedTaskDo.hints = JSON.stringify(JSON.parse(req.body.hints));
        inputBasedTaskDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await inputBasedTaskBo.update(inputBasedTaskDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Input based task updated successfully: ID ${inputBasedTaskDo.id}`);
                return res.redirect(`/input-based-task/update/${inputBasedTaskDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Input based task: ID ${inputBasedTaskDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('inputBasedTaskUpdateView', {
                    title: 'Update Input based task',
                    message: 'Input based task update failed. Input based task not found.',
                    pageStyles: ['update', 'taskHintManager', 'inputBasedTaskUpdate'],
                    pageScripts: ['taskHintManager', 'inputBasedTaskUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Input based task: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('inputBasedTaskUpdateView', {
                title: 'Update Input based task',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskHintManager', 'inputBasedTaskUpdate'],
                pageScripts: ['taskHintManager', 'inputBasedTaskUpdate'],
            });
        }
    },

    async deleteInputBasedTask(req, res)
    {
        const inputBasedTaskId = parseInt(req.params.id);
    
        try {
            const result = await inputBasedTaskBo.deleteById(inputBasedTaskId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Input based task deleted successfully: ID ${inputBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Input based task deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Input based task: ID ${inputBasedTaskId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Input based task not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Input based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getInputBasedTaskById(req, res)
    {
        const inputBasedTaskId = parseInt(req.params.id);

        try {
            const inputBasedTask = await inputBasedTaskBo.getById(inputBasedTaskId);
    
            if ( !inputBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Input based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: inputBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching input based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the input based task.',
            });
        }
    },

    async getInputBasedTaskList(req, res)
    {
        try {
            const inputBasedTasks = await inputBasedTaskBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: inputBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching input based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the input based task list.',
            });
        }
    },

    async getPaginatedInputBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const inputBasedTasks = await inputBasedTaskBo.getPaginated(page, limit);
            const total = await inputBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${inputBasedTasks.length} input based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    inputBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated input based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedInputBasedTaskById(req, res)
    {
        const inputBasedTaskId = parseInt(req.params.id);

        try {
            const inputBasedTask = await inputBasedTaskBo.getDetailedById(inputBasedTaskId);
    
            if ( !inputBasedTask )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Input based task not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: inputBasedTask,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed input based task: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed input based task.',
            });
        }
    },

    async getDetailedInputBasedTaskList(req, res)
    {
        try {
            const inputBasedTasks = await inputBasedTaskBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: inputBasedTasks,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed input based task list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed input based task list.',
            });
        }
    },

    async getDetailedPaginatedInputBasedTaskList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const inputBasedTasks = await inputBasedTaskBo.getDetailedPaginated(page, limit);
            const total = await inputBasedTaskBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${inputBasedTasks.length} input based tasks (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    inputBasedTasks,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated input based tasks: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async checkInputBasedTaskSolution(req, res)
    {
        let inputBasedTaskDo = new InputBasedTaskDo();
        inputBasedTaskDo.id = parseInt(req.params.id);
        inputBasedTaskDo.answer = req.body.answer;
        
        try {
            const isCorrect = await inputBasedTaskBo.checkSolution(inputBasedTaskDo);

            LogHelper.addMessage(`Checked Input based task solution with ID ${inputBasedTaskDo.id}`);
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