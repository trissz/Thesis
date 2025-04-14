const TaskTypeDao = require('../daos/taskTypeDao');
const TaskTypeDo = require('../dos/taskTypeDo');
const TaskTypeDto = require('../dtos/taskTypeDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class TaskTypeBo
{
    constructor()
    {
        this.taskTypeDao = new TaskTypeDao();
    }

    baseValidateFields(taskTypeDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(TaskTypeDo.requiredFields, ['name']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(taskTypeDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(taskTypeDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${taskTypeDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(taskTypeDo)
    {
        return this.baseValidateFields(taskTypeDo) ? await this.taskTypeDao.create(taskTypeDo) : null;
    }

    async getById(id)
    {
        return await this.taskTypeDao.getById(id);
    }

    async getAll()
    {
        return await this.taskTypeDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskTypeDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.taskTypeDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.taskTypeDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskTypeDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.taskTypeDao.getCount();
    }

    async deleteById(id)
    {
        return await this.taskTypeDao.deleteById(id);
    }

    async update(taskTypeDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(taskTypeDo.id) )
        {
            LogHelper.addError('Task type ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(taskTypeDo) ? await this.taskTypeDao.update(taskTypeDo) : null;
    }
}

module.exports = TaskTypeBo;