const AbstractDto = require('./abstractDto');

class AlgorithmImplementationDto extends AbstractDto
{
    static allowedFields = [
        'algorithmId', 'algorithmName', 'codeLanguageId',
        'codeLanguageName', 'codeLanguageNotation', 'codeLanguageKeyString',
        'codeLanguageDescription', 'complexityId', 'algorithmComplexityName',
        'algorithmComplexityName', 'algorithmComplexityNotation', 'name',
        'description', 'code'
    ];

    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = AlgorithmImplementationDto;