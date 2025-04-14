const CodeLanguageDao = require('../daos/codeLanguageDao');
const CodeLanguageDo = require('../dos/codeLanguageDo');
const CodeLanguageDto = require('../dtos/codeLanguageDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class CodeLanguageBo
{
    constructor()
    {
        this.codeLanguageDao = new CodeLanguageDao();
    }

    baseValidateFields(codeLanguageDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(CodeLanguageDo.requiredFields, ['name', 'notation', 'keyString', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(codeLanguageDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(codeLanguageDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${codeLanguageDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(codeLanguageDo)
    {
        return this.baseValidateFields(codeLanguageDo) ? await this.codeLanguageDao.create(codeLanguageDo) : null;
    }

    async getById(id)
    {
        return await this.codeLanguageDao.getById(id);
    }

    async getAllByUserId(id)
    {
        return await this.codeLanguageDao.getAllByUserId(id);
    }

    async getAll()
    {
        return await this.codeLanguageDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.codeLanguageDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.codeLanguageDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.codeLanguageDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.codeLanguageDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.codeLanguageDao.getCount();
    }

    async deleteById(id)
    {
        return await this.codeLanguageDao.deleteById(id);
    }

    async update(codeLanguageDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(codeLanguageDo.id) )
        {
            LogHelper.addError('Code language ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(codeLanguageDo) ? await this.codeLanguageDao.update(codeLanguageDo) : null;
    }
}

module.exports = CodeLanguageBo;