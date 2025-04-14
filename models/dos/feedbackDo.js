const AbstractDo = require('./abstractDo');

class FeedbackDo extends AbstractDo
{
    static allowedFields = ['userId', 'topic', 'content'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = FeedbackDo;