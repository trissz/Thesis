const AbstractDo = require('./abstractDo');

class ModuleDo extends AbstractDo
{
    static allowedFields = ['title', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = ModuleDo;