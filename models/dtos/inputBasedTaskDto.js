const AbstractDto = require('./abstractDto');

class InputBasedTaskDto extends AbstractDto
{
    static allowedFields = ['difficultyLevelId', 'taskDifficultyLevelName', 'taskDifficultyLevelDescription', 'content', 'answer', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = InputBasedTaskDto;