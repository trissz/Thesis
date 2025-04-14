const AbstractDo = require('./abstractDo');

class PermissionDo extends AbstractDo
{
    static allowedFields = ['roleId', 'operationId'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = PermissionDo;