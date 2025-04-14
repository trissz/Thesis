const AbstractDto = require('./abstractDto');

class AlgorithmDto extends AbstractDto
{
    static allowedFields = ['categoryId', 'algorithmCategoryName', 'difficultyLevelId', 'algorithmDifficultyLevelName', 'name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmDto;