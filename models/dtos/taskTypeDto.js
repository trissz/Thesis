const AbstractDto = require('./abstractDto');

class TaskTypeDto extends AbstractDto
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskTypeDto;