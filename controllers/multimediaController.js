const fs = require('fs');
const path = require('path');
const MultimediaBo = require('../models/bos/multimediaBo');
const MultimediaCategoryBo = require('../models/bos/multimediaCategoryBo');
const MultimediaDo = require('../models/dos/multimediaDo');
const MultimediaDto = require('../models/dtos/multimediaDto');
const upload = require('../config/multer');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const StringHelper = require('../models/helpers/stringHelper');
const multimediaBo = new MultimediaBo();
const multimediaCategoryBo = new MultimediaCategoryBo();
const multimediaDo = new MultimediaDo();

module.exports = {
    uploadFile: [
        upload.single('file'),
        async (req, res) => {
            const file = req.file;

            if ( !file )
            {
                LogHelper.addError('No file uploaded');
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('multimediaUploadView', {
                    title: 'File Upload',
                    message: 'No file uploaded. Please try again.',
                    pageStyles: ['multimediaUpload'],
                    pageScripts: ['multimediaUpload'],
                });
            }

            multimediaDo.categoryId = Number.parseInt(req.body.multimedia_category_id);
            const multimediaCategoryDo = await multimediaCategoryBo.getById(multimediaDo.categoryId);
            const categoryDir = path.join(__dirname, '../cdn', StringHelper.toSnakeCase(multimediaCategoryDo.name, ' ') + 's');
            
            if ( !fs.existsSync(categoryDir) )
            {
                fs.mkdirSync(categoryDir, { recursive: true });
            }

            const filePath = path.join(categoryDir, file.filename);
            fs.renameSync(file.path, filePath);

            multimediaDo.fileName = file.originalname;
            multimediaDo.filePath = file.path;
            multimediaDo.fileType = file.mimetype;
            multimediaDo.fileSize = file.size;

            try {
                const result = await multimediaBo.create(multimediaDo);

                if ( result )
                {
                    const multimediaId = result[0]?.insertId || 'unknown';
                    LogHelper.addConfirmation(`File uploaded successfully: ${file.originalname}, ID: ${multimediaId}`);

                    return res.status(HTTP_STATUS_CODES.OK).render('multimediaUploadView', {
                        title: 'File Upload',
                        message: 'File uploaded successfully.',
                        multimediaId,
                        pageStyles: ['create', 'multimediaUpload'],
                        pageScripts: ['multimediaUpload'],
                    });
                }
                else
                {
                    LogHelper.addError('Cannot upload file');
    
                    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('multimediaUploadView', {
                        title: 'File Upload',
                        message: 'Multimedia upload failed. Please try again.',
                        pageStyles: ['create', 'multimediaUpload'],
                        pageScripts: ['tableGenerate', 'multimediaUpload']
                    });
                }
            } catch ( error ) {
                LogHelper.addError(`Error uploading file: ${error.message}`);

                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('multimediaUploadView', {
                    title: 'File Upload',
                    message: 'An error occurred while uploading the file. Please try again later.',
                    pageStyles: ['create', 'multimediaUpload'],
                    pageScripts: ['multimediaUpload'],
                });
            }
        },
    ],

    async updateMultimedia(req, res)
    {
        let multimediaDo = new MultimediaDo();

        multimediaDo.id = parseInt(req.body.id);
        multimediaDo.fileName = req.body.file_name;
        multimediaDo.filePath = req.body.file_path;
        multimediaDo.fileType = req.body.file_type;
        multimediaDo.fileSize = req.body.file_size;
        multimediaDo.isActive = req.body.is_active === "on" ? 1 : 0;

        try {
            const existingItem = await multimediaBo.getById(multimediaDo.id);

            if ( !existingItem )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('multimediaUpdateView', {
                    title: 'Update Multimedia',
                    message: 'Multimedia not found',
                    pageStyles: ['update'],
                    pageScripts: ['multimediaUpdate']
                });
            }

            if ( multimediaDo.categoryId !== existingItem.categoryId )
            {
                const newCategory = await multimediaCategoryBo.getById(multimediaDo.categoryId);
                const newDir = path.join(__dirname, '../cdn', `${StringHelper.toSnakeCase(newCategory.name)}s`);
                const newPath = path.join(newDir, path.basename(existingItem.file_path));

                await fs.mkdir(newDir, { recursive: true });
                await fs.rename(existingItem.filePath, newPath);
                multimediaDo.filePath = newPath;
            }

            const result = await multimediaBo.update(multimediaDo);

            if ( result.affectedRows )
            {
                LogHelper.addConfirmation(`Multimedia updated: ID ${multimediaDo.id}`);
                return res.redirect(`/multimedia/update/${multimediaDo.id}`);
            }

            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('multimediaUpdateView', {
                title: 'Update Multimedia',
                message: 'Update failed',
                pageStyles: ['update'],
                pageScripts: ['multimediaUpdate']
            });
        } catch ( error ) {
            LogHelper.addError(`Multimedia update failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('multimediaUpdateView', {
                title: 'Update Multimedia',
                message: 'Server error during update',
                pageStyles: ['update'],
                pageScripts: ['multimediaUpdate']
            });
        }
    },

    async deleteMultimedia(req, res)
    {
        const multimediaId = parseInt(req.params.id);
        
        try {
            const multimedia = await multimediaBo.getById(multimediaId);

            if ( !multimedia )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ 
                    success: false, 
                    message: 'Multimedia not found' 
                });
            }

            await fs.unlink(multimedia.filePath);
            
            const result = await multimediaBo.deleteById(multimediaId);
            
            if ( result.affectedRows )
            {
                LogHelper.addConfirmation(`Multimedia deleted: ID ${multimediaId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ 
                    success: true,
                    message: 'Multimedia deleted successfully'
                });
            }
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ 
                success: false,
                message: 'Delete operation failed'
            });
        } catch ( error ) {
            LogHelper.addError(`Multimedia delete failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: 'Server error during deletion'
            });
        }
    },

    async getMultimediaById(req, res)
    {
        const multimediaId = parseInt(req.params.id);

        try {
            const multimedia = await multimediaBo.getDetailedById(multimediaId);

            if ( !multimedia )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ 
                    success: false,
                    error: 'Multimedia not found'
                });
            }
            return res.status(HTTP_STATUS_CODES.OK).json({ 
                success: true, 
                data: multimedia 
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch multimedia failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching multimedia'
            });
        }
    },

    async getMultimediaList(req, res)
    {
        try {
            const multimedia = await multimediaBo.getAll();
            return res.status(HTTP_STATUS_CODES.OK).json({ 
                success: true,
                data: multimedia
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch multimedia list failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching multimedia list'
            });
        }
    },

    async getPaginatedMultimediaList(req, res)
    {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const { results, total } = await multimediaBo.getPaginated(page, limit);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    multimedia: results,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total
                }
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch multimedia list failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching multimedia list'
            });
        }
    },

    async getDetailedMultimediaById(req, res)
    {
        const multimediaId = parseInt(req.params.id);

        try {
            const multimedia = await multimediaBo.getDetailedById(multimediaId);
            return res.status(HTTP_STATUS_CODES.OK).json({ 
                success: true,
                data: multimedia
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch detailed multimedia failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching detailed multimedia'
            });
        }
    },

    async getDetailedMultimediaList(req, res)
    {
        try {
            const multimedia = await multimediaBo.getDetailedAll();
            return res.status(HTTP_STATUS_CODES.OK).json({ 
                success: true,
                data: multimedia
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch detailed multimedia list failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching detailed multimedia list'
            });
        }
    },

    async getDetailedPaginatedMultimediaList(req, res)
    {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const { results, total } = await multimediaBo.getDetailedPaginated(page, limit);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    multimedia: results,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total
                }
            });
        } catch ( error ) {
            LogHelper.addError(`Fetch detailed multimedia list failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error fetching detailed multimedia list'
            });
        }
    },

    async searchMultimedia(req, res)
    {
        const query = req.query.q || '';
        const categoryId = req.query.category || '';

        try {
            const results = await multimediaBo.search(query, categoryId);
            return res.status(HTTP_STATUS_CODES.OK).json({ 
                success: true,
                data: results
            });
        } catch ( error ) {
            LogHelper.addError(`Search failed: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                error: 'Server error during search'
            });
        }
    },
};