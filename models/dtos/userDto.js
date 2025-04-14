const AbstractDto = require('./abstractDto');

class UserDto extends AbstractDto
{
    static allowedFields = ['roleId', 'roleName', 'name', 'email', 'passwordHash', 'registrationDatetime', 'lastLoginDatetime'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = UserDto;