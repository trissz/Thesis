const TaskDifficultyLevelDao = require('../daos/taskDifficultyLevelDao');
const TaskDifficultyLevelDo = require('../dos/taskDifficultyLevelDo');
const TaskDifficultyLevelDto = require('../dtos/taskDifficultyLevelDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class TaskDifficultyLevelBo
{
    constructor()
    {
        this.taskDifficultyLevelDao = new TaskDifficultyLevelDao();
    }

    baseValidateFields(taskDifficultyLevelDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(TaskDifficultyLevelDo.requiredFields, ['name', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(taskDifficultyLevelDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(taskDifficultyLevelDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${taskDifficultyLevelDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(taskDifficultyLevelDo)
    {
        return this.baseValidateFields(taskDifficultyLevelDo) ? await this.taskDifficultyLevelDao.create(taskDifficultyLevelDo) : null;
    }

    async getById(id)
    {
        return await this.taskDifficultyLevelDao.getById(id);
    }

    async getAll()
    {
        return await this.taskDifficultyLevelDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskDifficultyLevelDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.taskDifficultyLevelDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.taskDifficultyLevelDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskDifficultyLevelDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.taskDifficultyLevelDao.getCount();
    }

    async deleteById(id)
    {
        return await this.taskDifficultyLevelDao.deleteById(id);
    }

    async update(taskDifficultyLevelDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(taskDifficultyLevelDo.id) )
        {
            LogHelper.addError('Task difficulty level ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(taskDifficultyLevelDo) ? await this.taskDifficultyLevelDao.update(taskDifficultyLevelDo) : null;
    }
}

module.exports = TaskDifficultyLevelBo;