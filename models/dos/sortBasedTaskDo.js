const AbstractDo = require('./abstractDo');

class SortBasedTaskDo extends AbstractDo
{
    static allowedFields = ['difficultyLevelId', 'content', 'answer', 'elements', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = SortBasedTaskDo;