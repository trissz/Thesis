const AbstractDto = require('./abstractDto');

class CodeLanguageDto extends AbstractDto
{
    static allowedFields = ['name', 'notation', 'keyString', 'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = CodeLanguageDto;