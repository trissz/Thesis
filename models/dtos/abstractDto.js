const LogHelper = require("../helpers/logHelper");

class AbstractDto
{
    static abstractFieldList = ['classActor', 'id', 'isActive', 'createdAt', 'updatedAt'];

    constructor(attributes = {}, classActor = null)
    {
        if ( new.target === AbstractDto )
        {
            LogHelper.addError('Cannot instantiate an abstract class directly.');
            throw new Error('Cannot instantiate an abstract class directly.');
        }

        this.classActor = classActor;
        const allFields = (this.constructor.allowedFields || []).concat(AbstractDto.abstractFieldList || []);

        allFields.forEach(field => {
            this[field] = null;
        });

        this.validateAndAssignAttributes(attributes);
    }

    validateAndAssignAttributes(attributes)
    {
        const allFields = (this.constructor.allowedFields || []).concat(AbstractDto.abstractFieldList || []);
        const requiredFields = this.constructor.requiredFields || [];

        for ( const [key, value] of Object.entries(attributes) )
        {
            if ( !allFields.includes(key) )
            {
                LogHelper.addError(`Field is not allowed: ${key}`);
                throw new Error(`Field is not allowed: ${key}`);
            }

            this[key] = value;
        }

        for ( const field of requiredFields )
        {
            if ( !attributes[field] )
            {
                LogHelper.addError(`Missing required field: ${field}`);
                throw new Error(`Missing required field: ${field}`);
            }
        }
    }

    getAttributes()
    {
        return { ...this };
    }
}
  
module.exports = AbstractDto;