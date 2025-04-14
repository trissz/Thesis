const AbstractDo = require('./abstractDo');

class AchievementCategoryDo extends AbstractDo
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
        this.name = attributes.name || "";
    }
}

module.exports = AchievementCategoryDo;