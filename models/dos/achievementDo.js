const AbstractDo = require('./abstractDo');

class AchievementDo extends AbstractDo
{
    static allowedFields = ['userId', 'categoryId', 'title', 'description', 'value', 'dateAwarded'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AchievementDo;