const AlgorithmImplementationBo = require('../models/bos/algorithmImplementationBo');
const AlgorithmImplementationDo = require('../models/dos/algorithmImplementationDo');
const AlgorithmImplementationDto = require('../models/dtos/algorithmImplementationDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const algorithmImplementationBo = new AlgorithmImplementationBo();

module.exports = {
    async createAlgorithmImplementation(req, res)
    {
        let algorithmImplementationDo = new AlgorithmImplementationDo();

        algorithmImplementationDo.algorithmId = req.body.algorithm_id;
        algorithmImplementationDo.codeLanguageId = req.body.code_language_id;
        algorithmImplementationDo.complexityId = req.body.complexity_id;
        algorithmImplementationDo.name = req.body.name;
        algorithmImplementationDo.description = req.body.description;
        algorithmImplementationDo.code = req.body.code;

        /*
        let algorithmImplementationDo = new algorithmImplementationDo(req.body); //?
        */

        try {
            const result = await algorithmImplementationBo.create(algorithmImplementationDo);

            if ( result )
            {
                const algorithmImplementationId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Algorithm implementation created successfully: ID ${algorithmImplementationId}, Name: ${algorithmImplementationDo.name}`);
                return res.redirect('/algorithm-implementation/create');
            }
            else
            {
                LogHelper.addError('Cannot create Algorithm implementation');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('algorithmImplementationCreateView', {
                    title: 'Create Algorithm implementation',
                    message: 'AlgorithmImplementation creation failed. Please try again.',
                    pageStyles: ['codeEditor', 'create', 'algorithmImplementationCreate'],
                    pageLibraries: [
                        {directory: 'monaco', script: 'loader'}
                    ],
                    pageScripts: ['codeEditor', 'algorithmImplementationCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Algorithm implementation: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmImplementationCreateView', {
            title: 'Create Algorithm implementation',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['codeEditor', 'create', 'algorithmImplementationCreate'],
            pageLibraries: [
                {directory: 'monaco', script: 'loader'}
            ],
            pageScripts: ['codeEditor', 'algorithmImplementationCreate'],
        });
    },

    async updateAlgorithmImplementation(req, res)
    {
        let algorithmImplementationDo = new AlgorithmImplementationDo();

        algorithmImplementationDo.id = parseInt(req.params.id);
        algorithmImplementationDo.algorithmId = parseInt(req.body.algorithm_id);
        algorithmImplementationDo.codeLanguageId = parseInt(req.body.code_language_id);
        algorithmImplementationDo.complexityId = parseInt(req.body.complexity_id);
        algorithmImplementationDo.name = req.body.name;
        algorithmImplementationDo.description = req.body.description;
        algorithmImplementationDo.code = req.body.code;
        algorithmImplementationDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await algorithmImplementationBo.update(algorithmImplementationDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm implementation updated successfully: ID ${algorithmImplementationDo.id}, Name: ${algorithmImplementationDo.name}`);
                return res.redirect(`/algorithm-implementation/update/${algorithmImplementationDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Algorithm implementation: ID ${algorithmImplementationDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('algorithmImplementationUpdateView', {
                    title: 'Update Algorithm implementation',
                    message: 'Algorithm implementation update failed. Algorithm implementation not found.',
                    pageStyles: ['codeEditor', 'update', 'algorithmImplementationUpdate'],
                    pageLibraries: [
                        {directory: 'monaco', script: 'loader'}
                    ],
                    pageScripts: ['codeEditor', 'algorithmImplementationUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Algorithm implementation: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmImplementationUpdateView', {
                title: 'Update Algorithm implementation',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['codeEditor', 'update', 'algorithmImplementationUpdate'],
                pageLibraries: [
                    {directory: 'monaco', script: 'loader'}
                ],
                pageScripts: ['codeEditor', 'algorithmImplementationUpdate'],
            });
        }
    },

    async deleteAlgorithmImplementation(req, res)
    {
        const algorithmImplementationId = parseInt(req.params.id);
    
        try {
            const result = await algorithmImplementationBo.deleteById(algorithmImplementationId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm implementation deleted successfully: ID ${algorithmImplementationId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Algorithm implementation deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Algorithm implementation: ID ${algorithmImplementationId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Algorithm implementation not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Algorithm implementation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAlgorithmImplementationById(req, res)
    {
        const algorithmImplementationId = parseInt(req.params.id);

        try {
            const algorithmImplementation = await algorithmImplementationBo.getById(algorithmImplementationId);
    
            if ( !algorithmImplementation )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm implementation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementation,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm implementation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm implementation.',
            });
        }
    },

    async getAlgorithmImplementationListByAlgorithmId(req, res)
    {
        const algorithmId = parseInt(req.params.id);

        try {
            const algorithmImplementations = await algorithmImplementationBo.getAllByAlgorithmId(algorithmId);
    
            if ( !algorithmImplementations )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'No algorithm implementation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm implementations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm implementations.',
            });
        }
    },

    async getAlgorithmImplementationList(req, res)
    {
        try {
            const algorithmImplementations = await algorithmImplementationBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm implementation list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm implementation list.',
            });
        }
    },

    async getPaginatedAlgorithmImplementationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmImplementations = await algorithmImplementationBo.getPaginated(page, limit);
            const total = await algorithmImplementationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmImplementations.length} algorithm implementations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmImplementations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated algorithm implementations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAlgorithmImplementationById(req, res)
    {
        const algorithmImplementationId = parseInt(req.params.id);

        try {
            const algorithmImplementation = await algorithmImplementationBo.getDetailedById(algorithmImplementationId);
    
            if ( !algorithmImplementation )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm implementation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementation,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm implementation: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm implementation.',
            });
        }
    },

    async getDetailedAlgorithmImplementationListByAlgorithmId(req, res)
    {
        const algorithmId = parseInt(req.params.id);

        try {
            const algorithmImplementations = await algorithmImplementationBo.getDetailedAllByAlgorithmId(algorithmId);
    
            if ( !algorithmImplementations )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'No algorithm implementation not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm implementations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm implementations.',
            });
        }
    },

    async getDetailedAlgorithmImplementationList(req, res)
    {
        try {
            const algorithmImplementations = await algorithmImplementationBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmImplementations,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm implementation list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm implementation list.',
            });
        }
    },

    async getDetailedPaginatedAlgorithmImplementationList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmImplementations = await algorithmImplementationBo.getDetailedPaginated(page, limit);
            const total = await algorithmImplementationBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmImplementations.length} algorithm implementations (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmImplementations,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated algorithm implementations: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};