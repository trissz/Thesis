const FeedbackDao = require('../daos/feedbackDao');
const FeedbackDo = require('../dos/feedbackDo');
const FeedbackDto = require('../dtos/feedbackDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class FeedbackBo
{
    constructor()
    {
        this.feedbackDao = new FeedbackDao();
    }

    baseValidateFields(feedbackDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(FeedbackDo.requiredFields, ['userId', 'topic', 'content']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(feedbackDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(feedbackDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${feedbackDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(feedbackDo)
    {
        return this.baseValidateFields(feedbackDo) ? await this.feedbackDao.create(feedbackDo) : null;
    }

    async getById(id)
    {
        return await this.feedbackDao.getById(id);
    }

    async getAll()
    {
        return await this.feedbackDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.feedbackDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.feedbackDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.feedbackDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.feedbackDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.feedbackDao.getCount();
    }

    async deleteById(id)
    {
        return await this.feedbackDao.deleteById(id);
    }

    async update(feedbackDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(feedbackDo.id) )
        {
            LogHelper.addError('Feedback ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(feedbackDo) ? await this.feedbackDao.update(feedbackDo) : null;
    }
}

module.exports = FeedbackBo;