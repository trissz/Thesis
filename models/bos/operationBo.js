const OperationDao = require('../daos/operationDao');
const OperationDo = require('../dos/operationDo');
const OperationDto = require('../dtos/operationDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class OperationBo
{
    constructor()
    {
        this.operationDao = new OperationDao();
    }

    baseValidateFields(operationDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(OperationDo.requiredFields, ['name', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(operationDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(operationDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${operationDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(operationDo)
    {
        return this.baseValidateFields(operationDo) ? await this.operationDao.create(operationDo) : null;
    }

    async getById(id)
    {
        return await this.operationDao.getById(id);
    }

    async getAll()
    {
        return await this.operationDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.operationDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.operationDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.operationDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.operationDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.operationDao.getCount();
    }

    async deleteById(id)
    {
        return await this.operationDao.deleteById(id);
    }

    async update(operationDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(operationDo.id) )
        {
            LogHelper.addError('Operation ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(operationDo) ? await this.operationDao.update(operationDo) : null;
    }
}

module.exports = OperationBo;