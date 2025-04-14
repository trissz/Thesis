const AbstractDo = require('./abstractDo');

class TimeUnitDo extends AbstractDo
{
    static allowedFields = ['name', 'notation', 'secondsEquivalent'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = TimeUnitDo;