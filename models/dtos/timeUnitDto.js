const AbstractDto = require('./abstractDto');

class TimeUnitDto extends AbstractDto
{
    static allowedFields = ['name', 'notation', 'secondsEquivalent'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TimeUnitDto;