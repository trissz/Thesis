const AbstractDto = require('./abstractDto');

class MultimediaDto extends AbstractDto
{
    static allowedFields = ['categoryId', 'multimediaCategoryName', 'fileName', 'filePath', 'fileType', 'fileSize'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = MultimediaDto;