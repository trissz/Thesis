const ModuleBo = require('../models/bos/moduleBo');
const ModuleDo = require('../models/dos/moduleDo');
const ModuleDto = require('../models/dtos/moduleDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const moduleBo = new ModuleBo();

module.exports = {
    async createModule(req, res)
    {
        let moduleDo = new ModuleDo();

        moduleDo.title = req.body.title;
        moduleDo.description = req.body.description;

        /*
        let moduleDo = new moduleDo(req.body); //?
        */

        try {
            const result = await moduleBo.create(moduleDo);

            if ( result )
            {
                const moduleId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Module created successfully: ID ${moduleId}, Title: ${moduleDo.title}`);
                return res.redirect('/module/create');
            }
            else
            {
                LogHelper.addError('Cannot create Module');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('moduleCreateView', {
                    title: 'Create Module',
                    message: 'Module creation failed. Please try again.',
                    pageStyles: ['create', 'moduleCreate'],
                    pageScripts: ['moduleCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Module: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('moduleCreateView', {
                    title: 'Create Module',
                    message: 'Module name is already in use. Please try a different one.',
                    pageStyles: ['create', 'moduleCreate'],
                    pageScripts: ['moduleCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('moduleCreateView', {
            title: 'Create Module',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'moduleCreate'],
            pageScripts: ['moduleCreate'],
        });
    },
    
    async updateModule(req, res)
    {
        let moduleDo = new ModuleDo();

        moduleDo.id = parseInt(req.params.id);
        moduleDo.title = req.body.title;
        moduleDo.description = req.body.description;
        moduleDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await moduleBo.update(moduleDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Module updated successfully: ID ${moduleDo.id}, Title: ${moduleDo.title}`);
                return res.redirect(`/module/update/${moduleDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Module: ID ${moduleDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('moduleUpdateView', {
                    title: 'Update Module',
                    message: 'Module update failed. Module not found.',
                    pageStyles: ['update', 'moduleUpdate'],
                    pageScripts: ['moduleUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Module: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('moduleUpdateView', {
                title: 'Update Module',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'moduleUpdate'],
                pageScripts: ['moduleUpdate'],
            });
        }
    },

    async deleteModule(req, res)
    {
        const moduleId = parseInt(req.params.id);
    
        try {
            const result = await moduleBo.deleteById(moduleId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Module deleted successfully: ID ${moduleId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Module deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Module: ID ${moduleId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Module not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Module: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getModuleById(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const module = await moduleBo.getById(moduleId);
    
            if ( !module )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Module not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: module,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching module: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the module.',
            });
        }
    },

    async getModuleLessonsByModuleId(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const lessons = await moduleBo.getAllLessonById(moduleId);
    
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
                error: `An unexpected error occurred while fetching the lessons for module with ID ${moduleId}.`,
            });
        }
    },

    async getModuleList(req, res)
    {
        try {
            const modules = await moduleBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: modules,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching module list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the module list.',
            });
        }
    },

    async getPaginatedModuleList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const modules = await moduleBo.getPaginated(page, limit);
            const total = await moduleBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${modules.length} modules (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    modules,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated modules: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedModuleById(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const module = await moduleBo.getDetailedById(moduleId);
    
            if ( !module )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Module not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: module,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed module: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed module.',
            });
        }
    },

    async getDetailedModuleLessonsByModuleId(req, res)
    {
        const moduleId = parseInt(req.params.id);

        try {
            const lessons = await moduleBo.getDetailedAllLessonById(moduleId);
    
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
                error: `An unexpected error occurred while fetching the detailed lessons for module with ID ${moduleId}.`,
            });
        }
    },

    async getDetailedModuleList(req, res)
    {
        try {
            const modules = await moduleBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: modules,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed module list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed module list.',
            });
        }
    },

    async getDetailedPaginatedModuleList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const modules = await moduleBo.getDetailedPaginated(page, limit);
            const total = await moduleBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${modules.length} modules (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    modules,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated modules: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};