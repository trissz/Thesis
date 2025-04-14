const AbstractDo = require('./abstractDo');

class MultimediaCategoryDo extends AbstractDo
{
    static allowedFields = ['name'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
        this.name = attributes.name || "";
    }
}

module.exports = MultimediaCategoryDo;