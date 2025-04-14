const AbstractDo = require('./abstractDo');

class InputBasedTaskDo extends AbstractDo
{
    static allowedFields = ['difficultyLevelId', 'content', 'answer', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = InputBasedTaskDo;