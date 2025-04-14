const MultimediaCategoryDao = require('../daos/multimediaCategoryDao');
const MultimediaCategoryDo = require('../dos/multimediaCategoryDo');
const MultimediaCategoryDto = require('../dtos/multimediaCategoryDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class MultimediaCategoryBo
{
    constructor()
    {
        this.multimediaCategoryDao = new MultimediaCategoryDao();
    }

    baseValidateFields(multimediaCategoryDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(MultimediaCategoryDo.requiredFields, ['name']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(multimediaCategoryDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(multimediaCategoryDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${multimediaCategoryDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(multimediaCategoryDo)
    {
        return this.baseValidateFields(multimediaCategoryDo) ? await this.multimediaCategoryDao.create(multimediaCategoryDo) : null;
    }

    async getById(id)
    {
        return await this.multimediaCategoryDao.getById(id);
    }

    async getAll()
    {
        return await this.multimediaCategoryDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.multimediaCategoryDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.multimediaCategoryDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.multimediaCategoryDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.multimediaCategoryDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.multimediaCategoryDao.getCount();
    }

    async deleteById(id)
    {
        return await this.multimediaCategoryDao.deleteById(id);
    }

    async update(multimediaCategoryDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(multimediaCategoryDo.id) )
        {
            LogHelper.addError('Multimedia category ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(multimediaCategoryDo) ? await this.multimediaCategoryDao.update(multimediaCategoryDo) : null;
    }
}

module.exports = MultimediaCategoryBo;