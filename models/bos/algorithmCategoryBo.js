const AlgorithmCategoryDao = require('../daos/algorithmCategoryDao');
const AlgorithmCategoryDo = require('../dos/algorithmCategoryDo');
const AlgorithmCategoryDto = require('../dtos/algorithmCategoryDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AlgorithmCategoryBo
{
    constructor()
    {
        this.algorithmCategoryDao = new AlgorithmCategoryDao();
    }

    baseValidateFields(algorithmCategoryDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AlgorithmCategoryDo.requiredFields, ['name']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(algorithmCategoryDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(algorithmCategoryDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${algorithmCategoryDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(algorithmCategoryDo)
    {
        return this.baseValidateFields(algorithmCategoryDo) ? await this.algorithmCategoryDao.create(algorithmCategoryDo) : null;
    }

    async getById(id)
    {
        return await this.algorithmCategoryDao.getById(id);
    }

    async getAll()
    {
        return await this.algorithmCategoryDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmCategoryDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.algorithmCategoryDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.algorithmCategoryDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmCategoryDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.algorithmCategoryDao.getCount();
    }

    async deleteById(id)
    {
        return await this.algorithmCategoryDao.deleteById(id);
    }

    async update(algorithmCategoryDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(algorithmCategoryDo.id) )
        {
            LogHelper.addError('Algorithm category ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(algorithmCategoryDo) ? await this.algorithmCategoryDao.update(algorithmCategoryDo) : null;
    }
}

module.exports = AlgorithmCategoryBo;