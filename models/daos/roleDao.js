const RoleDo = require('../dos/roleDo');
const RoleDto = require('../dtos/roleDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class RoleDao
{
    async create(roleDo)
    {
        const queryString = `
            INSERT INTO 
                trisz_thesis.roles (name, description) 
            VALUES 
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                roleDo.name,
                roleDo.description
            ]
        );
    }

    async update(roleDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.roles ROLES
            SET
                ROLES.name        = ?,
                ROLES.description = ?,
                ROLES.is_active   = ?,
                ROLES.updated_at  = CURRENT_TIMESTAMP
            WHERE
                ROLES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                roleDo.name,
                roleDo.description,
                roleDo.isActive,
                roleDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.roles
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ROLES.id         AS id,
                ROLES.name       AS name,
                ROLES.is_active  AS isActive,
                ROLES.created_at AS createdAt,
                ROLES.updated_at AS updatedAt
            FROM
                trisz_thesis.roles ROLES
            WHERE
                ROLES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new RoleDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ROLES.id          AS id,
                ROLES.name        AS name,
                ROLES.description AS description,
                ROLES.is_active   AS isActive,
                ROLES.created_at  AS createdAt,
                ROLES.updated_at  AS updatedAt
            FROM
                trisz_thesis.roles ROLES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new RoleDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ROLES.id          AS id,
                ROLES.name        AS name,
                ROLES.description AS description,
                ROLES.is_active   AS isActive,
                ROLES.created_at  AS createdAt,
                ROLES.updated_at  AS updatedAt
            FROM
                trisz_thesis.roles ROLES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new RoleDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ROLES.id         AS id,
                ROLES.name       AS name,
                ROLES.is_active  AS isActive,
                ROLES.created_at AS createdAt,
                ROLES.updated_at AS updatedAt
            FROM
                trisz_thesis.roles ROLES
            WHERE
                ROLES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new RoleDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ROLES.id          AS id,
                ROLES.name        AS name,
                ROLES.description AS description,
                ROLES.is_active   AS isActive,
                ROLES.created_at  AS createdAt,
                ROLES.updated_at  AS updatedAt
            FROM
                trisz_thesis.roles ROLES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new RoleDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ROLES.id          AS id,
                ROLES.name        AS name,
                ROLES.description AS description,
                ROLES.is_active   AS isActive,
                ROLES.created_at  AS createdAt,
                ROLES.updated_at  AS updatedAt
            FROM
                trisz_thesis.roles ROLES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new RoleDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.roles ROLES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = RoleDao;