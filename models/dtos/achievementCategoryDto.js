const AbstractDto = require('./abstractDto');

class AchievementCategoryDto extends AbstractDto
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AchievementCategoryDto;