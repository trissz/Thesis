const AbstractDo = require('./abstractDo');

class AlgorithmCategoryDo extends AbstractDo
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmCategoryDo;