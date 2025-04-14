const AlgorithmImplementationDao = require('../daos/algorithmImplementationDao');
const AlgorithmImplementationDo = require('../dos/algorithmImplementationDo');
const AlgorithmImplementationDto = require('../dtos/algorithmImplementationDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AlgorithmImplementationBo
{
    constructor()
    {
        this.algorithmImplementationDao = new AlgorithmImplementationDao();
    }

    baseValidateFields(algorithmImplementationDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AlgorithmImplementationDo.requiredFields, ['algorithmId', 'codeLanguageId', 'complexityId', 'name', 'description', 'code']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(algorithmImplementationDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(algorithmImplementationDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${algorithmImplementationDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(algorithmImplementationDo)
    {
        return this.baseValidateFields(algorithmImplementationDo) ? await this.algorithmImplementationDao.create(algorithmImplementationDo) : null;
    }

    async getById(id)
    {
        return await this.algorithmImplementationDao.getById(id);
    }

    async getAllByAlgorithmId(id)
    {
        return await this.algorithmImplementationDao.getAllByAlgorithmId(id);
    }

    async getAll()
    {
        return await this.algorithmImplementationDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmImplementationDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.algorithmImplementationDao.getDetailedById(id);
    }

    async getDetailedAllByAlgorithmId(id)
    {
        return await this.algorithmImplementationDao.getDetailedAllByAlgorithmId(id);
    }

    async getDetailedAll()
    {
        return await this.algorithmImplementationDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.algorithmImplementationDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.algorithmImplementationDao.getCount();
    }

    async deleteById(id)
    {
        return await this.algorithmImplementationDao.deleteById(id);
    }

    async update(algorithmImplementationDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(algorithmImplementationDo.id) )
        {
            LogHelper.addError('Algorithm implementation ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(algorithmImplementationDo) ? await this.algorithmImplementationDao.update(algorithmImplementationDo) : null;
    }
}

module.exports = AlgorithmImplementationBo;