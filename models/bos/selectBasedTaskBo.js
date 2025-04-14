const SelectBasedTaskDao = require('../daos/selectBasedTaskDao');
const SelectBasedTaskDo = require('../dos/selectBasedTaskDo');
const SelectBasedTaskDto = require('../dtos/selectBasedTaskDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class SelectBasedTaskBo
{
    constructor()
    {
        this.selectBasedTaskDao = new SelectBasedTaskDao();
    }

    baseValidateFields(selectBasedTaskDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(SelectBasedTaskDo.requiredFields, ['difficultyLevelId', 'content', 'answer', 'options', 'hints']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(selectBasedTaskDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(selectBasedTaskDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${selectBasedTaskDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(selectBasedTaskDo)
    {
        return this.baseValidateFields(selectBasedTaskDo) ? await this.selectBasedTaskDao.create(selectBasedTaskDo) : null;
    }

    async getById(id)
    {
        return await this.selectBasedTaskDao.getById(id);
    }

    async getAll()
    {
        return await this.selectBasedTaskDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.selectBasedTaskDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.selectBasedTaskDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.selectBasedTaskDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.selectBasedTaskDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.selectBasedTaskDao.getCount();
    }

    async deleteById(id)
    {
        return await this.selectBasedTaskDao.deleteById(id);
    }

    async update(selectBasedTaskDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(selectBasedTaskDo.id) )
        {
            LogHelper.addError('Select based task ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(selectBasedTaskDo) ? await this.selectBasedTaskDao.update(selectBasedTaskDo) : null;
    }

    async checkSolution(submittedSelectBasedTaskDo)
    {
        const originalSelectBasedTaskDo = await this.selectBasedTaskDao.getById(submittedSelectBasedTaskDo.id);

        if ( !originalSelectBasedTaskDo )
        {
            LogHelper.addError(`Select based task with ID ${submittedSelectBasedTaskDo.id} not found`);
        }
        
        let correctAnswer = JSON.parse(originalSelectBasedTaskDo.answer);
        let submittedAnswer = JSON.parse(submittedSelectBasedTaskDo.answer);
        
        //return ArrayHelper.arraysEqual(correctAnswer, submittedAnswer);
        return ArrayHelper.arraysIdentical(correctAnswer, submittedAnswer);
    }
}

module.exports = SelectBasedTaskBo;