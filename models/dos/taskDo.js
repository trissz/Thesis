const AbstractDo = require('./abstractDo');

class TaskDo extends AbstractDo
{
    static allowedFields = ['typeId', 'difficultyLevelId', 'content', 'answer', 'elements', 'hints'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskDo;