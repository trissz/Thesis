const AchievementDao = require('../daos/achievementDao');
const AchievementDo = require('../dos/achievementDo');
const AchievementDto = require('../dtos/achievementDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AchievementBo
{
    constructor()
    {
        this.achievementDao = new AchievementDao();
    }

    baseValidateFields(achievementDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AchievementDo.requiredFields, ['userId', 'categoryId', 'title', 'description', 'value', 'dateAwarded']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(achievementDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(achievementDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${achievementDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(achievementDo)
    {
        return this.baseValidateFields(achievementDo) ? await this.achievementDao.create(achievementDo) : null;
    }

    async getById(id)
    {
        return await this.achievementDao.getById(id);
    }

    async getAllByUserId(id)
    {
        return await this.achievementDao.getAllByUserId(id);
    }

    async getAll()
    {
        return await this.achievementDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.achievementDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.achievementDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.achievementDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.achievementDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.achievementDao.getCount();
    }

    async deleteById(id)
    {
        return await this.achievementDao.deleteById(id);
    }

    async update(achievementDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(achievementDo.id) )
        {
            LogHelper.addError('Achievement ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(achievementDo) ? await this.achievementDao.update(achievementDo) : null;
    }
}

module.exports = AchievementBo;