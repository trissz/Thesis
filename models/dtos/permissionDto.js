const AbstractDto = require('./abstractDto');

class PermissionDto extends AbstractDto
{
    static allowedFields = ['roleId', 'roleName', 'roleDescription', 'operationId', 'operationName', 'operationDescription'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = PermissionDto;