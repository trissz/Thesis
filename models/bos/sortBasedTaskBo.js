const SortBasedTaskDao = require('../daos/sortBasedTaskDao');
const SortBasedTaskDo = require('../dos/sortBasedTaskDo');
const SortBasedTaskDto = require('../dtos/sortBasedTaskDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class SortBasedTaskBo
{
    constructor()
    {
        this.sortBasedTaskDao = new SortBasedTaskDao();
    }

    baseValidateFields(sortBasedTaskDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(SortBasedTaskDo.requiredFields, ['difficultyLevelId', 'content', 'answer', 'elements', 'hints']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(sortBasedTaskDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(sortBasedTaskDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${sortBasedTaskDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(sortBasedTaskDo)
    {
        return this.baseValidateFields(sortBasedTaskDo) ? await this.sortBasedTaskDao.create(sortBasedTaskDo) : null;
    }

    async getById(id)
    {
        return await this.sortBasedTaskDao.getById(id);
    }

    async getAll()
    {
        return await this.sortBasedTaskDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.sortBasedTaskDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.sortBasedTaskDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.sortBasedTaskDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.sortBasedTaskDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.sortBasedTaskDao.getCount();
    }

    async deleteById(id)
    {
        return await this.sortBasedTaskDao.deleteById(id);
    }

    async update(sortBasedTaskDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(sortBasedTaskDo.id) )
        {
            LogHelper.addError('Sort based task ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(sortBasedTaskDo) ? await this.sortBasedTaskDao.update(sortBasedTaskDo) : null;
    }

    async checkSolution(submittedSortBasedTaskDo)
    {
        const originalSortBasedTaskDo = await this.sortBasedTaskDao.getById(submittedSortBasedTaskDo.id);

        if ( !originalSortBasedTaskDo )
        {
            LogHelper.addError(`Sort based task with ID ${submittedSortBasedTaskDo.id} not found`);
        }
        
        let correctAnswer = JSON.parse(originalSortBasedTaskDo.answer);
        let submittedAnswer = JSON.parse(submittedSortBasedTaskDo.answer);
        
        return ArrayHelper.arraysEqual(correctAnswer, submittedAnswer);
    }
}

module.exports = SortBasedTaskBo;