const AbstractDto = require('./abstractDto');

class AlgorithmComplexityDto extends AbstractDto
{
    static allowedFields = ['name', 'notation'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmComplexityDto;