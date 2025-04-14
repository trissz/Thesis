const MultimediaDao = require('../daos/multimediaDao');
const MultimediaDo = require('../dos/multimediaDo');
const MultimediaDto = require('../dtos/multimediaDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class MultimediaBo
{
    constructor()
    {
        this.multimediaDao = new MultimediaDao();
    }

    isValidFileName(multimediaDo)
    {
        return UtilityHelper.isset(multimediaDo.fileName) && multimediaDo.fileName.length > 2;
    }

    baseValidateFields(multimediaDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(MultimediaDo.requiredFields, ['categoryId', 'fileName', 'filePath', 'fileType', 'fileSize']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(multimediaDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(multimediaDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${multimediaDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(multimediaDo)
    {
        let isCreateValid = true;

        isCreateValid = this.baseValidateFields(multimediaDo);

        if ( !this.isValidFileName(multimediaDo) )
        {
            LogHelper.addError('Invalid file name: ' + multimediaDo.fileName);
            isCreateValid = false;
        }

        /*if ( !UtilityHelper.isset(multimediaDo.url) )
        {
            LogHelper.addError('URL is required');
            isCreateValid = false;
        }

        if ( await this.multimediaDao.getByUrl(multimediaDo.url) )
        {
            LogHelper.addError('The given URL is already in use: ' + multimediaDo.url);
            isCreateValid = false;
        }*/

        return isCreateValid ? await this.multimediaDao.create(multimediaDo) : null;
    }

    async getById(id)
    {
        return await this.multimediaDao.getById(id);
    }

    async getAll()
    {
        return await this.multimediaDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.multimediaDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.multimediaDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.multimediaDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.multimediaDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.multimediaDao.getCount();
    }

    async deleteById(id)
    {
        return await this.multimediaDao.deleteById(id);
    }

    async update(multimediaDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(multimediaDo.id) )
        {
            LogHelper.addError('Multimedia ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(multimediaDo) ? await this.multimediaDao.update(multimediaDo) : null;
    }
}

module.exports = MultimediaBo;