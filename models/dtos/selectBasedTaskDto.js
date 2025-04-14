const AbstractDto = require('./abstractDto');

class SelectBasedTaskDto extends AbstractDto
{
    static allowedFields = ['difficultyLevelId', 'taskDifficultyLevelName', 'taskDifficultyLevelDescription', 'content', 'answer', 'options', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = SelectBasedTaskDto;