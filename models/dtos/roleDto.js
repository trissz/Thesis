const AbstractDto = require('./abstractDto');

class RoleDto extends AbstractDto
{
    static allowedFields = ['name', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = RoleDto;