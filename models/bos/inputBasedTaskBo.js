const InputBasedTaskDao = require('../daos/inputBasedTaskDao');
const InputBasedTaskDo = require('../dos/inputBasedTaskDo');
const InputBasedTaskDto = require('../dtos/inputBasedTaskDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');
const AnswerValidationHelper = require('../helpers/answerValidationHelper');

class InputBasedTaskBo
{
    constructor()
    {
        this.inputBasedTaskDao = new InputBasedTaskDao();
    }

    baseValidateFields(inputBasedTaskDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(InputBasedTaskDo.requiredFields, ['difficultyLevelId', 'content', 'answer', 'hints']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(inputBasedTaskDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(inputBasedTaskDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${inputBasedTaskDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(inputBasedTaskDo)
    {
        return this.baseValidateFields(inputBasedTaskDo) ? await this.inputBasedTaskDao.create(inputBasedTaskDo) : null;
    }

    async getById(id)
    {
        return await this.inputBasedTaskDao.getById(id);
    }

    async getAll()
    {
        return await this.inputBasedTaskDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.inputBasedTaskDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.inputBasedTaskDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.inputBasedTaskDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.inputBasedTaskDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.inputBasedTaskDao.getCount();
    }

    async deleteById(id)
    {
        return await this.inputBasedTaskDao.deleteById(id);
    }

    async update(inputBasedTaskDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(inputBasedTaskDo.id) )
        {
            LogHelper.addError('Input based task ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(inputBasedTaskDo) ? await this.inputBasedTaskDao.update(inputBasedTaskDo) : null;
    }

    /*async checkSolution(submittedInputBasedTaskDo)
    {
        const originalInputBasedTaskDo = await this.inputBasedTaskDao.getById(submittedInputBasedTaskDo.id);

        if ( !originalInputBasedTaskDo )
        {
            LogHelper.addError(`Input based task with ID ${submittedInputBasedTaskDo.id} not found`);
        }
        
        let correctAnswer = originalInputBasedTaskDo.answer;
        let submittedAnswer = submittedInputBasedTaskDo.answer;
        
        return correctAnswer == submittedAnswer;
    }*/

    async checkSolution(submittedInputBasedTaskDo)
    {
        const originalInputBasedTaskDo = await this.inputBasedTaskDao.getById(submittedInputBasedTaskDo.id);
    
        if ( !originalInputBasedTaskDo )
        {
            LogHelper.addError(`Input based task with ID ${submittedInputBasedTaskDo.id} not found`);
            return false;
        }
    
        return AnswerValidationHelper.validate(submittedInputBasedTaskDo.answer, originalInputBasedTaskDo.answer, "exact");
  }
}

module.exports = InputBasedTaskBo;