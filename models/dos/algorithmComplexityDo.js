const AbstractDo = require('./abstractDo');

class AlgorithmComplexityDo extends AbstractDo
{
    static allowedFields = ['name', 'notation'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmComplexityDo;