const AlgorithmBo = require('../models/bos/algorithmBo');
const AlgorithmDo = require('../models/dos/algorithmDo');
const AlgorithmDto = require('../models/dtos/algorithmDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const algorithmBo = new AlgorithmBo();

module.exports = {
    async createAlgorithm(req, res)
    {
        let algorithmDo = new AlgorithmDo();

        algorithmDo.categoryId = req.body.category_id;
        algorithmDo.difficultyLevelId = req.body.difficulty_level_id;
        algorithmDo.name = req.body.name;

        /*
        let algorithmDo = new algorithmDo(req.body); //?
        */

        try {
            const result = await algorithmBo.create(algorithmDo);

            if ( result )
            {
                const algorithmId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Algorithm created successfully: ID ${algorithmId}, Name: ${algorithmDo.name}`);
                return res.redirect('/algorithm/create');
            }
            else
            {
                LogHelper.addError('Cannot create Algorithm');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('algorithmCreateView', {
                    title: 'Create Algorithm',
                    message: 'Algorithm creation failed. Please try again.',
                    pageStyles: ['create', 'algorithmCreate'],
                    pageScripts: ['algorithmCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Algorithm: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('algorithmCreateView', {
                    title: 'Create Algorithm',
                    message: 'Algorithm name is already in use. Please try a different one.',
                    pageStyles: ['create', 'algorithmCreate'],
                    pageScripts: ['algorithmCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmCreateView', {
            title: 'Create Algorithm',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'algorithmCreate'],
            pageScripts: ['algorithmCreate'],
        });
    },

    async updateAlgorithm(req, res)
    {
        let algorithmDo = new AlgorithmDo();

        algorithmDo.id = parseInt(req.params.id);
        algorithmDo.categoryId = parseInt(req.body.category_id);
        algorithmDo.difficultyLevelId = parseInt(req.body.difficulty_level_id);
        algorithmDo.name = req.body.name;
        algorithmDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await algorithmBo.update(algorithmDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm updated successfully: ID ${algorithmDo.id}, Name: ${algorithmDo.name}`);
                return res.redirect(`/algorithm/update/${algorithmDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Algorithm: ID ${algorithmDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('algorithmUpdateView', {
                    title: 'Update Algorithm',
                    message: 'Algorithm update failed. Algorithm not found.',
                    pageStyles: ['update', 'algorithmUpdate'],
                    pageScripts: ['algorithmUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Algorithm: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmUpdateView', {
                title: 'Update Algorithm',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'algorithmUpdate'],
                pageScripts: ['algorithmUpdate'],
            });
        }
    },

    async deleteAlgorithm(req, res)
    {
        const algorithmId = parseInt(req.params.id);
    
        try {
            const result = await algorithmBo.deleteById(algorithmId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm deleted successfully: ID ${algorithmId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Algorithm deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Algorithm: ID ${algorithmId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Algorithm not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Algorithm: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAlgorithmById(req, res)
    {
        const algorithmId = parseInt(req.params.id);

        try {
            const algorithm = await algorithmBo.getById(algorithmId);
    
            if ( !algorithm )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithm,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm.',
            });
        }
    },

    async getAlgorithmList(req, res)
    {
        try {
            const algorithms = await algorithmBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithms,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm list.',
            });
        }
    },

    async getPaginatedAlgorithmList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithms = await algorithmBo.getPaginated(page, limit);
            const total = await algorithmBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithms.length} algorithms (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithms,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated algorithms: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAlgorithmById(req, res)
    {
        const algorithmId = parseInt(req.params.id);

        try {
            const algorithm = await algorithmBo.getDetailedById(algorithmId);
    
            if ( !algorithm )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithm,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm.',
            });
        }
    },

    async getDetailedAlgorithmList(req, res)
    {
        try {
            const algorithms = await algorithmBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithms,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm list.',
            });
        }
    },

    async getDetailedPaginatedAlgorithmList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithms = await algorithmBo.getDetailedPaginated(page, limit);
            const total = await algorithmBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithms.length} algorithms (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithms,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated algorithms: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};