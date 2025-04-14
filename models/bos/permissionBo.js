const PermissionDao = require('../daos/permissionDao');
const PermissionDo = require('../dos/permissionDo');
const PermissionDto = require('../dtos/permissionDto');
const UserDao = require('../daos/userDao');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class PermissionBo
{
    static #initialized = false;
    static permissionCache = new Map();

    constructor()
    {
        this.permissionDao = new PermissionDao();
        this.userDao = new UserDao();
    }

    static async initialize()
    {
        if ( !this.#initialized )
        {
            await this.loadAllPermissions();
            this.#initialized = true;
        }
    }

    static async loadAllPermissions()
    {
        const permissions = await new PermissionDao().getAll();
        
        permissions.forEach(({ roleId, operationId }) => {
            if ( !this.permissionCache.has(roleId) )
            {
                this.permissionCache.set(roleId, new Set());
            }

            this.permissionCache.get(roleId).add(operationId);
        });
    }

    async hasPermission(userId, operationId)
    {
        await PermissionBo.initialize();
        
        const user = await this.userDao.getById(userId);
        return PermissionBo.permissionCache.get(user.roleId)?.has(operationId) || false;
    }

    /*async hasPermission(userId, operationId)
    {
        return await this.permissionDao.hasPermission(userId, operationId);
    }*/

    baseValidateFields(permissionDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(PermissionDo.requiredFields, ['roleId', 'operationId']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(permissionDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(permissionDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${permissionDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(permissionDo)
    {
        return this.baseValidateFields(permissionDo) ? await this.permissionDao.create(permissionDo) : null;
    }

    async getById(id)
    {
        return await this.permissionDao.getById(id);
    }

    async getAllByRoleId(roleId)
    {
        return await this.permissionDao.getAllByRoleId(roleId);
    }

    async getByRoleIdAndOperationId(roleId, operationId)
    {
        return await this.permissionDao.getByRoleIdAndOperationId(roleId, operationId);
    }

    async getAll()
    {
        return await this.permissionDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.permissionDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.permissionDao.getDetailedById(id);
    }

    async getDetailedAllByRoleId(roleId)
    {
        return await this.permissionDao.getDetailedAllByRoleId(roleId);
    }

    async getDetailedByRoleIdAndOperationId(roleId, operationId)
    {
        return await this.permissionDao.getDetailedByRoleIdAndOperationId(roleId, operationId);
    }

    async getDetailedAll()
    {
        return await this.permissionDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.permissionDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.permissionDao.getCount();
    }

    async deleteById(id)
    {
        return await this.permissionDao.deleteById(id);
    }

    async update(permissionDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(permissionDo.id) )
        {
            LogHelper.addError('Permission ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(permissionDo) ? await this.permissionDao.update(permissionDo) : null;
    }
}

module.exports = PermissionBo;