const AbstractDo = require('./abstractDo');

class TaskDifficultyLevelDo extends AbstractDo
{
    static allowedFields = ['name', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskDifficultyLevelDo;