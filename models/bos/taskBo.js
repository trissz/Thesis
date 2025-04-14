const TaskDao = require('../daos/taskDao');
const TaskDo = require('../dos/taskDo');
const TaskDto = require('../dtos/taskDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class TaskBo
{
    constructor()
    {
        this.taskDao = new TaskDao();
    }

    baseValidateFields(taskDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(TaskDo.requiredFields, ['typeId', 'difficultyLevelId', 'content', 'answer', 'elements', 'hints']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(taskDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(taskDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${taskDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(taskDo)
    {
        return this.baseValidateFields(taskDo) ? await this.taskDao.create(taskDo) : null;
    }

    async getById(id)
    {
        return await this.taskDao.getById(id);
    }

    async getAll()
    {
        return await this.taskDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.taskDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.taskDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.taskDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.taskDao.getCount();
    }

    async deleteById(id)
    {
        return await this.taskDao.deleteById(id);
    }

    async update(taskDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(taskDo.id) )
        {
            LogHelper.addError('Task ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(taskDo) ? await this.taskDao.update(taskDo) : null;
    }

    async checkSolution(submittedTaskDo)
    {
        //Implement checking here . . . . .
        const originalTaskDo = await this.taskDao.getById(submittedTaskDo.id);

        if ( !originalTaskDo )
        {
            LogHelper.addError(`Task with ID ${submittedTaskDo.id} not found`);
        }
        
        let correctAnswer = JSON.parse(originalTaskDo.answer);
        let submittedAnswer = JSON.parse(submittedTaskDo.answer);
        
        return ArrayHelper.arraysEqual(correctAnswer, submittedAnswer);
    }
}

module.exports = TaskBo;