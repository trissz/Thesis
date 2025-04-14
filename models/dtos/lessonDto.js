const AbstractDto = require('./abstractDto');

class LessonDto extends AbstractDto
{
    static allowedFields = ['moduleId', 'moduleTitle', 'moduleDescription', 'timeUnitId', 'timeUnitName', 'timeUnitNotation', 'timeUnitSecondsEquivalent', 'title', 'content', 'estimatedTimeValue'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = LessonDto;