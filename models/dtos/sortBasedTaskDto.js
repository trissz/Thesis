const AbstractDto = require('./abstractDto');

class SortBasedTaskDto extends AbstractDto
{
    static allowedFields = ['difficultyLevelId', 'taskDifficultyLevelName', 'taskDifficultyLevelDescription', 'content', 'answer', 'elements', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = SortBasedTaskDto;