const AbstractDto = require('./abstractDto');

class FeedbackDto extends AbstractDto
{
    static allowedFields = ['userId', 'userName', 'userEmail', 'topic', 'content'];
    static requiredFields = [];

    constructor(attributes = {}, classActor = null)
    {
        super(attributes, classActor);
    }
}

module.exports = FeedbackDto;