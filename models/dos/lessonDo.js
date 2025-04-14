const AbstractDo = require('./abstractDo');

class LessonDo extends AbstractDo
{
    static allowedFields = ['moduleId', 'timeUnitId', 'title', 'content', 'estimatedTimeValue'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = LessonDo;