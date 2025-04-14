const AbstractDto = require('./abstractDto');

class AlgorithmCategoryDto extends AbstractDto
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmCategoryDto;