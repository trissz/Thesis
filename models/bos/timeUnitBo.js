const TimeUnitDao = require('../daos/timeUnitDao');
const TimeUnitDo = require('../dos/timeUnitDo');
const TimeUnitDto = require('../dtos/timeUnitDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class TimeUnitBo
{
    constructor()
    {
        this.timeUnitDao = new TimeUnitDao();
    }

    baseValidateFields(timeUnitDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(TimeUnitDo.requiredFields, ['name', 'notation', 'secondsEquivalent']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(timeUnitDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(timeUnitDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${timeUnitDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(timeUnitDo)
    {
        return this.baseValidateFields(timeUnitDo) ? await this.timeUnitDao.create(timeUnitDo) : null;
    }

    async getById(id)
    {
        return await this.timeUnitDao.getById(id);
    }

    async getAll()
    {
        return await this.timeUnitDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.timeUnitDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.timeUnitDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.timeUnitDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.timeUnitDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.timeUnitDao.getCount();
    }

    async deleteById(id)
    {
        return await this.timeUnitDao.deleteById(id);
    }

    async update(timeUnitDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(timeUnitDo.id) )
        {
            LogHelper.addError('Time unit ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(timeUnitDo) ? await this.timeUnitDao.update(timeUnitDo) : null;
    }
}

module.exports = TimeUnitBo;