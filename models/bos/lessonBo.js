const LessonDao = require('../daos/lessonDao');
const LessonDo = require('../dos/lessonDo');
const LessonDto = require('../dtos/lessonDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class LessonBo
{
    constructor()
    {
        this.lessonDao = new LessonDao();
    }

    baseValidateFields(lessonDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(LessonDo.requiredFields, ['moduleId', 'timeUnitId', 'title', 'content', 'estimatedTimeValue']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(lessonDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(lessonDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${lessonDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(lessonDo)
    {
        return this.baseValidateFields(lessonDo) ? await this.lessonDao.create(lessonDo) : null;
    }

    async getById(id)
    {
        return await this.lessonDao.getById(id);
    }

    async getAllByModuleId(moduleId)
    {
        return await this.lessonDao.getAllByModuleId(moduleId);
    }

    async getAll()
    {
        return await this.lessonDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.lessonDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.lessonDao.getDetailedById(id);
    }

    async getDetailedAllByModuleId(moduleId)
    {
        return await this.lessonDao.getDetailedAllByModuleId(moduleId);
    }

    async getDetailedAll()
    {
        return await this.lessonDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.lessonDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.lessonDao.getCount();
    }

    async deleteById(id)
    {
        return await this.lessonDao.deleteById(id);
    }

    async update(lessonDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(lessonDo.id) )
        {
            LogHelper.addError('Lesson ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(lessonDo) ? await this.lessonDao.update(lessonDo) : null;
    }
}

module.exports = LessonBo;