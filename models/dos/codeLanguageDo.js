const AbstractDo = require('./abstractDo');

class CodeLanguageDo extends AbstractDo
{
    static allowedFields = ['name', 'notation', 'keyString',  'description'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = CodeLanguageDo;