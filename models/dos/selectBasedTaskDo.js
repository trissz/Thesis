const AbstractDo = require('./abstractDo');

class SelectBasedTaskDo extends AbstractDo
{
    static allowedFields = ['difficultyLevelId', 'content', 'answer', 'options', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = SelectBasedTaskDo;