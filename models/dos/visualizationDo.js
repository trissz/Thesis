const AbstractDo = require('./abstractDo');

class VisualizationDo extends AbstractDo
{
    static allowedFields = ['title', 'description', 'scriptCode'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = VisualizationDo;