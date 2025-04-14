const AbstractDo = require('./abstractDo');

class AlgorithmDo extends AbstractDo
{
    static allowedFields = ['categoryId', 'difficultyLevelId', 'name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmDo;