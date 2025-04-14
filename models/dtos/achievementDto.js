const AbstractDto = require('./abstractDto');

class AchievementDto extends AbstractDto
{
    static allowedFields = ['userId', 'userName', 'userEmail', 'categoryId', 'achievementCategoryName', 'title', 'description', 'value', 'dateAwarded'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AchievementDto;