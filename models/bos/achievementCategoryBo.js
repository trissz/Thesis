const AchievementCategoryDao = require('../daos/achievementCategoryDao');
const AchievementCategoryDo = require('../dos/achievementCategoryDo');
const AchievementCategoryDto = require('../dtos/achievementCategoryDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class AchievementCategoryBo
{
    constructor()
    {
        this.achievementCategoryDao = new AchievementCategoryDao();
    }

    baseValidateFields(achievementCategoryDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(AchievementCategoryDo.requiredFields, ['name']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(achievementCategoryDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(achievementCategoryDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${achievementCategoryDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(achievementCategoryDo)
    {
        return this.baseValidateFields(achievementCategoryDo) ? await this.achievementCategoryDao.create(achievementCategoryDo) : null;
    }

    async getById(id)
    {
        return await this.achievementCategoryDao.getById(id);
    }

    async getAll()
    {
        return await this.achievementCategoryDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.achievementCategoryDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.achievementCategoryDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.achievementCategoryDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.achievementCategoryDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.achievementCategoryDao.getCount();
    }

    async deleteById(id)
    {
        return await this.achievementCategoryDao.deleteById(id);
    }

    async update(achievementCategoryDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(achievementCategoryDo.id) )
        {
            LogHelper.addError('Achievement category ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(achievementCategoryDo) ? await this.achievementCategoryDao.update(achievementCategoryDo) : null;
    }
}

module.exports = AchievementCategoryBo;