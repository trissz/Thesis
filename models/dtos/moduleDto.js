const AbstractDto = require('./abstractDto');

class ModuleDto extends AbstractDto
{
    static allowedFields = ['title', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = ModuleDto;