const AbstractDo = require('./abstractDo');

class OperationDo extends AbstractDo
{
    static allowedFields = ['name', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = OperationDo;