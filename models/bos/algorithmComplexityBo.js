const AlgorithmComplexityDao = require('../daos/algorithmComplexityDao');
const AlgorithmComplexityDo = require('../dos/algorithmComplexityDo');
const AlgorithmComplexityDto = require('../dtos/algorithmComplexityDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AlgorithmComplexityBo
{
    constructor()
    {
        this.algorithmComplexityDao = new AlgorithmComplexityDao();
    }

    baseValidateFields(algorithmComplexityDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AlgorithmComplexityDo.requiredFields, ['name', 'notation']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(algorithmComplexityDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(algorithmComplexityDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${algorithmComplexityDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(algorithmComplexityDo)
    {
        return this.baseValidateFields(algorithmComplexityDo) ? await this.algorithmComplexityDao.create(algorithmComplexityDo) : null;
    }

    async getById(id)
    {
        return await this.algorithmComplexityDao.getById(id);
    }

    async getAll()
    {
        return await this.algorithmComplexityDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmComplexityDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.algorithmComplexityDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.algorithmComplexityDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmComplexityDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.algorithmComplexityDao.getCount();
    }

    async deleteById(id)
    {
        return await this.algorithmComplexityDao.deleteById(id);
    }

    async update(algorithmComplexityDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(algorithmComplexityDo.id) )
        {
            LogHelper.addError('Algorithm complexity ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(algorithmComplexityDo) ? await this.algorithmComplexityDao.update(algorithmComplexityDo) : null;
    }
}

module.exports = AlgorithmComplexityBo;