const AbstractDto = require('./abstractDto');

class VisualizationDto extends AbstractDto
{
    static allowedFields = ['title', 'description', 'scriptCode'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = VisualizationDto;