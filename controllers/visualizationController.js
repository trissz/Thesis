const VisualizationBo = require('../models/bos/visualizationBo');
const VisualizationDo = require('../models/dos/visualizationDo');
const VisualizationDto = require('../models/dtos/visualizationDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const visualizationBo = new VisualizationBo();

module.exports = {
    async createVisualization(req, res)
    {
        let visualizationDo = new VisualizationDo();

        visualizationDo.title = req.body.title;
        visualizationDo.description = req.body.description;
        visualizationDo.scriptCode = req.body.script_code;
        visualizationDo.isActive = req.body.is_active;

        /*
        let visualizationDo = new visualizationDo(req.body); //?
        */

        try {
            const result = await visualizationBo.create(visualizationDo);

            if ( result )
            {
                const visualizationId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Visualization created successfully: ID ${visualizationId}, Title: ${visualizationDo.title}`);
                return res.redirect('/visualization/create');
            }
            else
            {
                LogHelper.addError('Cannot create Visualization');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('visualizationCreateView', {
                    title: 'Create Visualization',
                    message: 'Visualization creation failed. Please try again.',
                    pageStyles: ['create', 'visualizationCreate'],
                    pageScripts: ['visualizationCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Visualization: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('visualizationCreateView', {
            title: 'Create Visualization',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'visualizationCreate'],
            pageScripts: ['visualizationCreate'],
        });
    },

    async updateVisualization(req, res)
    {
        let visualizationDo = new VisualizationDo();

        visualizationDo.id = parseInt(req.params.id);
        visualizationDo.title = req.body.title;
        visualizationDo.description = req.body.description;
        visualizationDo.scriptCode = req.body.script_code;
        visualizationDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await visualizationBo.update(visualizationDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Visualization updated successfully: ID ${visualizationDo.id}, Title: ${visualizationDo.title}`);
                return res.redirect(`/visualization/update/${visualizationDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Visualization: ID ${visualizationDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('visualizationUpdateView', {
                    title: 'Update Visualization',
                    message: 'Visualization update failed. Visualization not found.',
                    pageStyles: ['codeEditor', 'update', 'visualizationUpdate'],
                    pageLibraries: [
                        {directory: 'monaco', script: 'loader'}
                    ],
                    pageScripts: ['codeEditor', 'visualizationUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Visualization: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('visualizationUpdateView', {
                title: 'Update Visualization',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['codeEditor', 'update', 'visualizationUpdate'],
                pageLibraries: [
                    {directory: 'monaco', script: 'loader'}
                ],
                pageScripts: ['codeEditor', 'visualizationUpdate'],
            });
        }
    },

    async deleteVisualization(req, res)
    {
        const visualizationId = parseInt(req.params.id);
    
        try {
            const result = await visualizationBo.deleteById(visualizationId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Visualization deleted successfully: ID ${visualizationId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Visualization deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Visualization: ID ${visualizationId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Visualization not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Visualization: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getVisualizationById(req, res)
    {
        const visualizationId = parseInt(req.params.id);

        try {
            const visualization = await visualizationBo.getById(visualizationId);
    
            if ( !visualization )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Visualization not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: visualization,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching visualization: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the visualization.',
            });
        }
    },

    async getVisualizationList(req, res)
    {
        try {
            const visualizations = await visualizationBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: visualizations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching visualization list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the visualization list.',
            });
        }
    },

    async getPaginatedVisualizationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const visualizations = await visualizationBo.getPaginated(page, limit);
            const total = await visualizationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${visualizations.length} visualizations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    visualizations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated visualizations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedVisualizationById(req, res)
    {
        const visualizationId = parseInt(req.params.id);

        try {
            const visualization = await visualizationBo.getDetailedById(visualizationId);
    
            if ( !visualization )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Visualization not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: visualization,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed visualization: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed visualization.',
            });
        }
    },

    async getDetailedVisualizationList(req, res)
    {
        try {
            const visualizations = await visualizationBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: visualizations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed visualization list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed visualization list.',
            });
        }
    },

    async getDetailedPaginatedVisualizationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const visualizations = await visualizationBo.getDetailedPaginated(page, limit);
            const total = await visualizationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${visualizations.length} visualizations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    visualizations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated visualizations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};