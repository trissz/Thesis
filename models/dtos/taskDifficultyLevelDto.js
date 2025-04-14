const AbstractDto = require('./abstractDto');

class TaskDifficultyLevelDto extends AbstractDto
{
    static allowedFields = ['name', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskDifficultyLevelDto;