const AlgorithmDao = require('../daos/algorithmDao');
const AlgorithmDo = require('../dos/algorithmDo');
const AlgorithmDto = require('../dtos/algorithmDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AlgorithmBo
{
    constructor()
    {
        this.algorithmDao = new AlgorithmDao();
    }

    baseValidateFields(algorithmDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AlgorithmDo.requiredFields, ['categoryId', 'difficultyLevelId', 'name']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(algorithmDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(algorithmDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${algorithmDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(algorithmDo)
    {
        return this.baseValidateFields(algorithmDo) ? await this.algorithmDao.create(algorithmDo) : null;
    }

    async getById(id)
    {
        return await this.algorithmDao.getById(id);
    }

    async getAll()
    {
        return await this.algorithmDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.algorithmDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.algorithmDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.algorithmDao.getCount();
    }

    async deleteById(id)
    {
        return await this.algorithmDao.deleteById(id);
    }

    async update(algorithmDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(algorithmDo.id) )
        {
            LogHelper.addError('Algorithm ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(algorithmDo) ? await this.algorithmDao.update(algorithmDo) : null;
    }
}

module.exports = AlgorithmBo;