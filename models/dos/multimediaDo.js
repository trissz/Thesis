const AbstractDo = require('./abstractDo');

class MultimediaDo extends AbstractDo
{
    static allowedFields = ['categoryId', 'fileName', 'filePath', 'fileType', 'fileSize'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = MultimediaDo;