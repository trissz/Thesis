const AbstractDto = require('./abstractDto');

class TaskDto extends AbstractDto
{
    static allowedFields = ['typeId', 'taskTypeName', 'difficultyLevelId', 'taskDifficultyLevelName', 'content', 'answer', 'elements', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskDto;