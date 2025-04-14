const TaskTypeBo = require('../models/bos/taskTypeBo');
const TaskTypeDo = require('../models/dos/taskTypeDo');
const TaskTypeDto = require('../models/dtos/taskTypeDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const taskTypeBo = new TaskTypeBo();

module.exports = {
    async createTaskType(req, res)
    {
        let taskTypeDo = new TaskTypeDo();

        taskTypeDo.name = req.body.name;

        /*
        let taskTypeDo = new TaskTypeDo(req.body); //?
        */

        try {
            const result = await taskTypeBo.create(taskTypeDo);

            if ( result )
            {
                const taskTypeId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Task type created successfully: ID ${taskTypeId}, Name: ${taskTypeDo.name}`);
                return res.redirect('/task-type/create');
            }
            else
            {
                LogHelper.addError('Cannot create task type');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('userCreateView', {
                    title: 'Create Task type',
                    message: 'Task type creation failed. Please try again.',
                    pageStyles: ['create', 'taskTypeCreate'],
                    pageScripts: ['taskTypeCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating task type: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('taskTypeCreateView', {
                    title: 'Create Task type',
                    message: 'Task type name is already in use. Please try a different one.',
                    pageStyles: ['create', 'taskTypeCreate'],
                    pageScripts: ['taskTypeCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskTypeCreateView', {
            title: 'Create Task type',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'taskTypeCreate'],
            pageScripts: ['taskTypeCreate'],
        });
    },

    async updateTaskType(req, res)
    {
        let taskTypeDo = new TaskTypeDo();

        taskTypeDo.id = parseInt(req.params.id);
        taskTypeDo.name = req.body.name;
        taskTypeDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await taskTypeBo.update(taskTypeDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task type updated successfully: ID ${taskTypeDo.id}, Name: ${taskTypeDo.name}`);
                return res.redirect(`/task-type/update/${taskTypeDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Task type: ID ${taskTypeDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('taskTypeUpdateView', {
                    title: 'Update Task type',
                    message: 'Task type update failed. Task type not found.',
                    pageStyles: ['update', 'taskTypeUpdate'],
                    pageScripts: ['taskTypeUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Task type: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('taskTypeUpdateView', {
                title: 'Update Task type',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'taskTypeUpdate'],
                pageScripts: ['taskTypeUpdate'],
            });
        }
    },

    async deleteTaskType(req, res)
    {
        const taskTypeId = parseInt(req.params.id);
    
        try {
            const result = await taskTypeBo.deleteById(taskTypeId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Task type deleted successfully: ID ${taskTypeId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Task type deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Task type: ID ${taskTypeId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Task type not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Task type: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getTaskTypeById(req, res)
    {
        const taskTypeId = parseInt(req.params.id);

        try {
            const taskType = await taskTypeBo.getById(taskTypeId);
    
            if ( !taskType )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task type not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskType,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching task type: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task type.',
            });
        }
    },

    async getTaskTypeList(req, res)
    {
        try {
            const taskTypes = await taskTypeBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskTypes,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching task type list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the task type list.',
            });
        }
    },

    async getPaginatedTaskTypeList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const taskTypes = await taskTypeBo.getPaginated(page, limit);
            const total = await taskTypeBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${taskTypes.length} task types (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    taskTypes,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated task types: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedTaskTypeById(req, res)
    {
        const taskTypeId = parseInt(req.params.id);

        try {
            const taskType = await taskTypeBo.getDetailedById(taskTypeId);
    
            if ( !taskType )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Task type not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskType,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task type: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task type.',
            });
        }
    },

    async getDetailedTaskTypeList(req, res)
    {
        try {
            const taskTypes = await taskTypeBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: taskTypes,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed task type list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed task type list.',
            });
        }
    },

    async getDetailedPaginatedTaskTypeList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const taskTypes = await taskTypeBo.getDetailedPaginated(page, limit);
            const total = await taskTypeBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${taskTypes.length} taskTypes (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    taskTypes,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated task types: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};