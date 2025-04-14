const PermissionDo = require('../dos/permissionDo');
const PermissionDto = require('../dtos/permissionDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class PermissionDao
{
    async hasPermission(userId, operationId)
    {
        const queryString = `
            SELECT
                1
            FROM
                trisz_thesis.users USERS
            JOIN
                trisz_thesis.roles ROLES
            ON
                USERS.role_id = ROLES.id
            JOIN
                trisz_thesis.permissions PERMISSIONS
            ON
                ROLES.id = PERMISSIONS.role_id
            WHERE
                USERS.id = ? AND PERMISSIONS.operation_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [
                userId,
                operationId
            ]
        );
        
        return rows.length > 0;
    }

    async create(permissionDo)
    {
        const queryString = `
            INSERT INTO 
                trisz_thesis.permissions (role_id, operation_id) 
            VALUES 
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                permissionDo.roleId,
                permissionDo.operationId
            ]
        );
    }

    async update(permissionDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.permissions PERMISSIONS
            SET
                PERMISSIONS.role_id      = ?,
                PERMISSIONS.operation_id = ?,
                PERMISSIONS.is_active    = ?,
                PERMISSIONS.updated_at   = CURRENT_TIMESTAMP
            WHERE
                PERMISSIONS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                permissionDo.roleId,
                permissionDo.operationId,
                permissionDo.isActive,
                permissionDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.permissions
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id            AS id,
                PERMISSIONS.role_id       AS roleId,
                PERMISSIONS.operation_id  AS operationId,
                PERMISSIONS.created_at    AS createdAt,
                PERMISSIONS.updated_at    AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            WHERE
                PERMISSIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new PermissionDo(row);
    }

    async getAllByRoleId(roleId)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                PERMISSIONS.operation_id AS operationId,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            WHERE
                PERMISSIONS.role_id = ?
        `;
    
        const [rows] = await databaseConnectionBo.query(
            queryString,
            [roleId]
        );

        return rows.map(row => new PermissionDo(row));
    }

    async getByRoleIdAndOperationId(roleId, operationId)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                PERMISSIONS.operation_id AS operationId,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            WHERE
                PERMISSIONS.role_id = ? AND PERMISSIONS.operation_id = ?
        `;
    
        const [rows] = await databaseConnectionBo.query(
            queryString,
            [
                roleId,
                operationId
            ]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new PermissionDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                PERMISSIONS.id            AS id,
                PERMISSIONS.role_id       AS roleId,
                PERMISSIONS.operation_id  AS operationId,
                PERMISSIONS.is_active     AS isActive,
                PERMISSIONS.created_at    AS createdAt,
                PERMISSIONS.updated_at    AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new PermissionDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id            AS id,
                PERMISSIONS.role_id       AS roleId,
                PERMISSIONS.operation_id  AS operationId,
                PERMISSIONS.is_active     AS isActive,
                PERMISSIONS.created_at    AS createdAt,
                PERMISSIONS.updated_at    AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new PermissionDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                ROLES.name               AS roleName,
                ROLES.description        AS roleDescription,
                PERMISSIONS.operation_id AS operationId,
                OPERATIONS.name          AS operationName,
                OPERATIONS.description   AS operationDescription,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            JOIN
                trisz_thesis.roles ROLES
            ON
                PERMISSIONS.role_id = ROLES.id
            JOIN
                trisz_thesis.operations OPERATIONS
            ON
                PERMISSIONS.operation_id = OPERATIONS.id
            WHERE
                PERMISSIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new PermissionDto(row);
    }

    async getDetailedAllByRoleId(roleId)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                ROLES.name               AS roleName,
                ROLES.description        AS roleDescription,
                PERMISSIONS.operation_id AS operationId,
                OPERATIONS.name          AS operationName,
                OPERATIONS.description   AS operationDescription,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            JOIN
                trisz_thesis.roles ROLES
            ON
                PERMISSIONS.role_id = ROLES.id
            JOIN
                trisz_thesis.operations OPERATIONS
            ON
                PERMISSIONS.operation_id = OPERATIONS.id
            WHERE
                PERMISSIONS.role_id = ?
        `;
    
        const [rows] = await databaseConnectionBo.query(
            queryString,
            [roleId]
        );

        return rows.map(row => new PermissionDto(row));
    }

    async getDetailedByRoleIdAndOperationId(roleId, operationId) 
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                ROLES.name               AS roleName,
                ROLES.description        AS roleDescription,
                PERMISSIONS.operation_id AS operationId,
                OPERATIONS.name          AS operationName,
                OPERATIONS.description   AS operationDescription,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            JOIN
                trisz_thesis.roles ROLES
            ON
                PERMISSIONS.role_id = ROLES.id
            JOIN
                trisz_thesis.operations OPERATIONS
            ON
                PERMISSIONS.operation_id = OPERATIONS.id
            WHERE
                PERMISSIONS.role_id = ? AND PERMISSIONS.operation_id = ?
        `;
    
        const [rows] = await databaseConnectionBo.query(
            queryString,
            [
                roleId,
                operationId
            ]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new PermissionDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                ROLES.name               AS roleName,
                ROLES.description        AS roleDescription,
                PERMISSIONS.operation_id AS operationId,
                OPERATIONS.name          AS operationName,
                OPERATIONS.description   AS operationDescription,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            JOIN
                trisz_thesis.roles ROLES
            ON
                PERMISSIONS.role_id = ROLES.id
            JOIN
                trisz_thesis.operations OPERATIONS
            ON
                PERMISSIONS.operation_id = OPERATIONS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new PermissionDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                PERMISSIONS.id           AS id,
                PERMISSIONS.role_id      AS roleId,
                ROLES.name               AS roleName,
                ROLES.description        AS roleDescription,
                PERMISSIONS.operation_id AS operationId,
                OPERATIONS.name          AS operationName,
                OPERATIONS.description   AS operationDescription,
                PERMISSIONS.created_at   AS createdAt,
                PERMISSIONS.updated_at   AS updatedAt
            FROM
                trisz_thesis.permissions PERMISSIONS
            JOIN
                trisz_thesis.roles ROLES
            ON
                PERMISSIONS.role_id = ROLES.id
            JOIN
                trisz_thesis.operations OPERATIONS
            ON
                PERMISSIONS.operation_id = OPERATIONS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new PermissionDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.permissions PERMISSIONS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = PermissionDao;