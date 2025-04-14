const AbstractDo = require('./abstractDo');

class RoleDo extends AbstractDo
{
    static allowedFields = ['name', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = RoleDo;