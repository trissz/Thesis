const AbstractDo = require('./abstractDo');

class TaskTypeDo extends AbstractDo
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TaskTypeDo;