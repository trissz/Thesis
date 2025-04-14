const RoleDao = require('../daos/roleDao');
const RoleDo = require('../dos/roleDo');
const RoleDto = require('../dtos/roleDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class RoleBo
{
    constructor()
    {
        this.roleDao = new RoleDao();
    }

    baseValidateFields(roleDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(RoleDo.requiredFields, ['name', 'description']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(roleDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(roleDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${roleDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(roleDo)
    {
        return this.baseValidateFields(roleDo) ? await this.roleDao.create(roleDo) : null;
    }

    async getById(id)
    {
        return await this.roleDao.getById(id);
    }

    async getAll()
    {
        return await this.roleDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.roleDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.roleDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.roleDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.roleDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.roleDao.getCount();
    }

    async deleteById(id)
    {
        return await this.roleDao.deleteById(id);
    }

    async update(roleDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(roleDo.id) )
        {
            LogHelper.addError('Role ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(roleDo) ? await this.roleDao.update(roleDo) : null;
    }
}

module.exports = RoleBo;