const CodeLanguageBo = require('../models/bos/codeLanguageBo');
const CodeLanguageDo = require('../models/dos/codeLanguageDo');
const CodeLanguageDto = require('../models/dtos/codeLanguageDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const codeLanguageBo = new CodeLanguageBo();

module.exports = {
    async createCodeLanguage(req, res)
    {
        let codeLanguageDo = new CodeLanguageDo();

        codeLanguageDo.name = req.body.name;
        codeLanguageDo.notation = req.body.notation;
        codeLanguageDo.keyString = req.body.key_string;
        codeLanguageDo.description = req.body.description;

        /*
        let codeLanguageDo = new codeLanguageDo(req.body); //?
        */

        try {
            const result = await codeLanguageBo.create(codeLanguageDo);

            if ( result )
            {
                const codeLanguageId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Code language created successfully: ID ${codeLanguageId}, Name: ${codeLanguageDo.name}`);
                return res.redirect('/code-language/create');
            }
            else
            {
                LogHelper.addError('Cannot create Code language');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('codeLanguageCreateView', {
                    title: 'Create Code language',
                    message: 'Code language creation failed. Please try again.',
                    pageStyles: ['create', 'codeLanguageCreate'],
                    pageScripts: ['codeLanguageCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating Code language: ${error.message}`);
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('codeLanguageCreateView', {
            title: 'Create Code language',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'codeLanguageCreate'],
            pageScripts: ['codeLanguageCreate'],
        });
    },

    async updateCodeLanguage(req, res)
    {
        let codeLanguageDo = new CodeLanguageDo();

        codeLanguageDo.id = parseInt(req.params.id);
        codeLanguageDo.name = req.body.name;
        codeLanguageDo.notation = req.body.notation;
        codeLanguageDo.keyString = req.body.key_string;
        codeLanguageDo.description = req.body.description;
        codeLanguageDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await codeLanguageBo.update(codeLanguageDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Code language updated successfully: ID ${codeLanguageDo.id}, Name: ${codeLanguageDo.name}`);
                return res.redirect(`/code-language/update/${codeLanguageDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Code language: ID ${codeLanguageDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('codeLanguageUpdateView', {
                    title: 'Update Code language',
                    message: 'Code language update failed. Code language not found.',
                    pageStyles: ['update', 'codeLanguageUpdate'],
                    pageScripts: ['codeLanguageUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Code language: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('codeLanguageUpdateView', {
                title: 'Update Code language',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'codeLanguageUpdate'],
                pageScripts: ['codeLanguageUpdate'],
            });
        }
    },

    async deleteCodeLanguage(req, res)
    {
        const codeLanguageId = parseInt(req.params.id);

        try {
            const result = await codeLanguageBo.deleteById(codeLanguageId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Code language deleted successfully: ID ${codeLanguageId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Code language deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Code language: ID ${codeLanguageId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Code language not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Code language: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getCodeLanguageById(req, res)
    {
        const codeLanguageId = parseInt(req.params.id);

        try {
            const codeLanguage = await codeLanguageBo.getById(codeLanguageId);
    
            if ( !codeLanguage )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Code codelanguage not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: codeLanguage,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching code codelanguage: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the code codelanguage.',
            });
        }
    },

    async getCodeLanguageList(req, res)
    {
        try {
            const codeLanguages = await codeLanguageBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: codeLanguages,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching code language list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the code language list.',
            });
        }
    },

    async getPaginatedCodeLanguageList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const codeLanguages = await codeLanguageBo.getPaginated(page, limit);
            const total = await codeLanguageBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${codeLanguages.length} code languages (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    codeLanguages,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated code languages: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedCodeLanguageById(req, res)
    {
        const codeLanguageId = parseInt(req.params.id);

        try {
            const codeLanguage = await codeLanguageBo.getDetailedById(codeLanguageId);
    
            if ( !codeLanguage )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Code language not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: codeLanguage,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed code language: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed code language.',
            });
        }
    },

    async getDetailedCodeLanguageList(req, res)
    {
        try {
            const codeLanguages = await codeLanguageBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: codeLanguages,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed code language list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed code language list.',
            });
        }
    },

    async getDetailedPaginatedCodeLanguageList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const codeLanguages = await codeLanguageBo.getDetailedPaginated(page, limit);
            const total = await codeLanguageBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${codeLanguages.length} code languages (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    codeLanguages,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated code languages: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};