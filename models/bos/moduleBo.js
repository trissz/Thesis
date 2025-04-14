const ModuleDao = require('../daos/moduleDao');
const ModuleDo = require('../dos/moduleDo');
const ModuleDto = require('../dtos/moduleDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class ModuleBo
{
    constructor()
    {
        this.moduleDao = new ModuleDao();
    }

    baseValidateFields(moduleDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(ModuleDo.requiredFields, ['title', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(moduleDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(moduleDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${moduleDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(moduleDo)
    {
        return this.baseValidateFields(moduleDo) ? await this.moduleDao.create(moduleDo) : null;
    }

    async getById(id)
    {
        return await this.moduleDao.getById(id);
    }

    async getAllLessonById(id)
    {
        return await this.moduleDao.getAllLessonById(id);
    }

    async getAll()
    {
        return await this.moduleDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.moduleDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.moduleDao.getDetailedById(id);
    }

    async getDetailedAllLessonById(id)
    {
        return await this.moduleDao.getDetailedAllLessonById(id);
    }

    async getDetailedAll()
    {
        return await this.moduleDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.moduleDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.moduleDao.getCount();
    }

    async deleteById(id)
    {
        return await this.moduleDao.deleteById(id);
    }

    async update(moduleDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(moduleDo.id) )
        {
            LogHelper.addError('Module ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(moduleDo) ? await this.moduleDao.update(moduleDo) : null;
    }
}

module.exports = ModuleBo;