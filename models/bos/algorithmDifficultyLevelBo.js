const AlgorithmDifficultyLevelDao = require('../daos/algorithmDifficultyLevelDao');
const AlgorithmDifficultyLevelDo = require('../dos/algorithmDifficultyLevelDo');
const AlgorithmDifficultyLevelDto = require('../dtos/algorithmDifficultyLevelDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AlgorithmDifficultyLevelBo
{
    constructor()
    {
        this.algorithmDifficultyLevelDao = new AlgorithmDifficultyLevelDao();
    }

    baseValidateFields(algorithmDifficultyLevelDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AlgorithmDifficultyLevelDo.requiredFields, ['name', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(algorithmDifficultyLevelDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(algorithmDifficultyLevelDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${algorithmDifficultyLevelDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(algorithmDifficultyLevelDo)
    {
        return this.baseValidateFields(algorithmDifficultyLevelDo) ? await this.algorithmDifficultyLevelDao.create(algorithmDifficultyLevelDo) : null;
    }

    async getById(id)
    {
        return await this.algorithmDifficultyLevelDao.getById(id);
    }

    async getAll()
    {
        return await this.algorithmDifficultyLevelDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmDifficultyLevelDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.algorithmDifficultyLevelDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.algorithmDifficultyLevelDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmDifficultyLevelDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.algorithmDifficultyLevelDao.getCount();
    }

    async deleteById(id)
    {
        return await this.algorithmDifficultyLevelDao.deleteById(id);
    }

    async update(algorithmDifficultyLevelDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(algorithmDifficultyLevelDo.id) )
        {
            LogHelper.addError('Algorithm difficulty level ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(algorithmDifficultyLevelDo) ? await this.algorithmDifficultyLevelDao.update(algorithmDifficultyLevelDo) : null;
    }
}

module.exports = AlgorithmDifficultyLevelBo;