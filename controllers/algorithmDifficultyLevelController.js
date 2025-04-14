const AlgorithmDifficultyLevelBo = require('../models/bos/algorithmDifficultyLevelBo');
const AlgorithmDifficultyLevelDo = require('../models/dos/algorithmDifficultyLevelDo');
const AlgorithmDifficultyLevelDto = require('../models/dtos/algorithmDifficultyLevelDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const algorithmDifficultyLevelBo = new AlgorithmDifficultyLevelBo();

module.exports = {
    async createAlgorithmDifficultyLevel(req, res)
    {
        let algorithmDifficultyLevelDo = new AlgorithmDifficultyLevelDo();

        algorithmDifficultyLevelDo.name = req.body.name;
        algorithmDifficultyLevelDo.description = req.body.description;

        /*
        let algorithmDifficultyLevelDo = new algorithmDifficultyLevelDo(req.body); //?
        */

        try {
            const result = await algorithmDifficultyLevelBo.create(algorithmDifficultyLevelDo);

            if ( result )
            {
                const algorithmDifficultyLevelId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Algorithm difficulty level created successfully: ID ${algorithmDifficultyLevelId}, Name: ${algorithmDifficultyLevelDo.name}`);
                return res.redirect('/algorithm-difficulty-level/create');
            }
            else
            {
                LogHelper.addError('Cannot create Algorithm difficulty level');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('algorithmDifficultyLevelCreateView', {
                    title: 'Create Algorithm difficulty level',
                    message: 'Algorithm difficulty level creation failed. Please try again.',
                    pageStyles: ['create', 'algorithmDifficultyLevelCreate'],
                    pageScripts: ['algorithmDifficultyLevelCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Algorithm difficulty level: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('algorithmDifficultyLevelCreateView', {
                    title: 'Create Algorithm difficulty level',
                    message: 'Algorithm difficulty level name is already in use. Please try a different one.',
                    pageStyles: ['create', 'algorithmDifficultyLevelCreate'],
                    pageScripts: ['algorithmDifficultyLevelCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmDifficultyLevelCreateView', {
            title: 'Create Algorithm difficulty level',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'algorithmDifficultyLevelCreate'],
            pageScripts: ['algorithmDifficultyLevelCreate'],
        });
    },

    async updateAlgorithmDifficultyLevel(req, res)
    {
        let algorithmDifficultyLevelDo = new AlgorithmDifficultyLevelDo();

        algorithmDifficultyLevelDo.id = parseInt(req.params.id);
        algorithmDifficultyLevelDo.name = req.body.name;
        algorithmDifficultyLevelDo.description = req.body.description;
        algorithmDifficultyLevelDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await algorithmDifficultyLevelBo.update(algorithmDifficultyLevelDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm difficulty level updated successfully: ID ${algorithmDifficultyLevelDo.id}, Name: ${algorithmDifficultyLevelDo.name}`);
                return res.redirect(`/algorithm-difficultyLevel/update/${algorithmDifficultyLevelDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Algorithm difficulty level: ID ${algorithmDifficultyLevelDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('algorithmDifficultyLevelUpdateView', {
                    title: 'Update Algorithm difficulty level',
                    message: 'AlgorithmDifficultyLevel update failed. Algorithm difficulty level not found.',
                    pageStyles: ['update', 'algorithmDifficultyLevelUpdate'],
                    pageScripts: ['algorithmDifficultyLevelUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Algorithm difficulty level: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmDifficultyLevelUpdateView', {
                title: 'Update Algorithm difficulty level',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'algorithmDifficultyLevelUpdate'],
                pageScripts: ['algorithmDifficultyLevelUpdate'],
            });
        }
    },

    async deleteAlgorithmDifficultyLevel(req, res)
    {
        const algorithmDifficultyLevelId = parseInt(req.params.id);
    
        try {
            const result = await algorithmDifficultyLevelBo.deleteById(algorithmDifficultyLevelId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm difficulty level deleted successfully: ID ${algorithmDifficultyLevelId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Algorithm difficulty level deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Algorithm difficulty level: ID ${algorithmDifficultyLevelId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Algorithm difficulty level not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Algorithm difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAlgorithmDifficultyLevelById(req, res)
    {
        const algorithmDifficultyLevelId = parseInt(req.params.id);

        try {
            const algorithmDifficultyLevel = await algorithmDifficultyLevelBo.getById(algorithmDifficultyLevelId);
    
            if ( !algorithmDifficultyLevel )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm difficulty level not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmDifficultyLevel,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm difficulty level.',
            });
        }
    },

    async getAlgorithmDifficultyLevelList(req, res)
    {
        try {
            const algorithmDifficultyLevels = await algorithmDifficultyLevelBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmDifficultyLevels,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm difficulty level list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm difficulty level list.',
            });
        }
    },

    async getPaginatedAlgorithmDifficultyLevelList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmDifficultyLevels = await algorithmDifficultyLevelBo.getPaginated(page, limit);
            const total = await algorithmDifficultyLevelBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmDifficultyLevels.length} algorithm difficulty levels (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmDifficultyLevels,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated algorithm difficulty levels: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAlgorithmDifficultyLevelById(req, res)
    {
        const algorithmDifficultyLevelId = parseInt(req.params.id);

        try {
            const algorithmDifficultyLevel = await algorithmDifficultyLevelBo.getDetailedById(algorithmDifficultyLevelId);
    
            if ( !algorithmDifficultyLevel )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm difficulty level not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmDifficultyLevel,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm difficulty level: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm difficulty level.',
            });
        }
    },

    async getDetailedAlgorithmDifficultyLevelList(req, res)
    {
        try {
            const algorithmDifficultyLevels = await algorithmDifficultyLevelBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmDifficultyLevels,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm difficulty level list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm difficulty level list.',
            });
        }
    },

    async getDetailedPaginatedAlgorithmDifficultyLevelList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmDifficultyLevels = await algorithmDifficultyLevelBo.getDetailedPaginated(page, limit);
            const total = await algorithmDifficultyLevelBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmDifficultyLevels.length} algorithm difficulty levels (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmDifficultyLevels,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated algorithm difficulty levels: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};