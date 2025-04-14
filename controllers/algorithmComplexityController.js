const AlgorithmComplexityBo = require('../models/bos/algorithmComplexityBo');
const AlgorithmComplexityDo = require('../models/dos/algorithmComplexityDo');
const AlgorithmComplexityDto = require('../models/dtos/algorithmComplexityDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const algorithmComplexityBo = new AlgorithmComplexityBo();

module.exports = {
    async createAlgorithmComplexity(req, res)
    {
        let algorithmComplexityDo = new AlgorithmComplexityDo();

        algorithmComplexityDo.name = req.body.name;
        algorithmComplexityDo.notation = req.body.notation;

        /*
        let algorithmComplexityDo = new algorithmComplexityDo(req.body); //?
        */

        try {
            const result = await algorithmComplexityBo.create(algorithmComplexityDo);

            if ( result )
            {
                const algorithmComplexityId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Algorithm complexity created successfully: ID ${algorithmComplexityId}, Name: ${algorithmComplexityDo.name}`);
                return res.redirect('/algorithm-complexity/create');
            }
            else
            {
                LogHelper.addError('Cannot create Algorithm complexity');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('algorithmComplexityCreateView', {
                    title: 'Create Algorithm complexity',
                    message: 'Algorithm complexity creation failed. Please try again.',
                    pageStyles: ['create', 'algorithmComplexityCreate'],
                    pageScripts: ['algorithmComplexityCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Algorithm complexity: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('algorithmComplexityCreateView', {
                    title: 'Create Algorithm complexity',
                    message: 'Algorithm complexity name is already in use. Please try a different one.',
                    pageStyles: ['create', 'algorithmComplexityCreate'],
                    pageScripts: ['algorithmComplexityCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmComplexityCreateView', {
            title: 'Create Algorithm complexity',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'algorithmComplexityCreate'],
            pageScripts: ['algorithmComplexityCreate'],
        });
    },

    async updateAlgorithmComplexity(req, res)
    {
        let algorithmComplexityDo = new AlgorithmComplexityDo();

        algorithmComplexityDo.id = parseInt(req.params.id);
        algorithmComplexityDo.name = req.body.name;
        algorithmComplexityDo.notation = req.body.notation;
        algorithmComplexityDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await algorithmComplexityBo.update(algorithmComplexityDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm complexity updated successfully: ID ${algorithmComplexityDo.id}, Name: ${algorithmComplexityDo.name}`);
                return res.redirect(`/algorithm-complexity/update/${algorithmComplexityDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Algorithm complexity: ID ${algorithmComplexityDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('algorithmComplexityUpdateView', {
                    title: 'Update Algorithm complexity',
                    message: 'Algorithm complexity update failed. Algorithm complexity not found.',
                    pageStyles: ['update', 'algorithmComplexityUpdate'],
                    pageScripts: ['algorithmComplexityUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Algorithm complexity: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('algorithmComplexityUpdateView', {
                title: 'Update Algorithm complexity',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'algorithmComplexityUpdate'],
                pageScripts: ['algorithmComplexityUpdate'],
            });
        }
    },

    async deleteAlgorithmComplexity(req, res)
    {
        const algorithmComplexityId = parseInt(req.params.id);
    
        try {
            const result = await algorithmComplexityBo.deleteById(algorithmComplexityId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Algorithm complexity deleted successfully: ID ${algorithmComplexityId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Algorithm complexity deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Algorithm complexity: ID ${algorithmComplexityId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Algorithm complexity not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Algorithm complexity: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getAlgorithmComplexityById(req, res)
    {
        const algorithmComplexityId = parseInt(req.params.id);

        try {
            const algorithmComplexity = await algorithmComplexityBo.getById(algorithmComplexityId);
    
            if ( !algorithmComplexity )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm complexity not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmComplexity,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm complexity: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm complexity.',
            });
        }
    },

    async getAlgorithmComplexityList(req, res)
    {
        try {
            const algorithmComplexities = await algorithmComplexityBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmComplexities,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching algorithm complexity list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the algorithm complexity list.',
            });
        }
    },

    async getPaginatedAlgorithmComplexityList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmComplexities = await algorithmComplexityBo.getPaginated(page, limit);
            const total = await algorithmComplexityBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmComplexities.length} algorithm complexities (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmComplexities,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated algorithm complexities: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedAlgorithmComplexityById(req, res)
    {
        const algorithmComplexityId = parseInt(req.params.id);

        try {
            const algorithmComplexity = await algorithmComplexityBo.getDetailedById(algorithmComplexityId);
    
            if ( !algorithmComplexity )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Algorithm complexity not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmComplexity,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm complexity: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm complexity.',
            });
        }
    },

    async getDetailedAlgorithmComplexityList(req, res)
    {
        try {
            const algorithmComplexities = await algorithmComplexityBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: algorithmComplexities,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed algorithm complexity list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed algorithm complexity list.',
            });
        }
    },

    async getDetailedPaginatedAlgorithmComplexityList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const algorithmComplexities = await algorithmComplexityBo.getDetailedPaginated(page, limit);
            const total = await algorithmComplexityBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${algorithmComplexities.length} algorithm complexities (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    algorithmComplexities,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated algorithm complexities: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};