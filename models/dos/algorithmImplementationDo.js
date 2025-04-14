const AbstractDo = require('./abstractDo');

class AlgorithmImplementationDo extends AbstractDo
{
    static allowedFields = ['algorithmId', 'codeLanguageId', 'complexityId', 'name', 'description', 'code'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmImplementationDo;