const UserDo = require('../dos/userDo');
const UserDto = require('../dtos/userDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class UserDao
{
    async create(userDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.users (role_id, name, email, password_hash) 
            VALUES
                (?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                userDo.roleId,
                userDo.name,
                userDo.email,
                userDo.passwordHash
            ]
        );
    }

    async updateLastLoginById(id)
    {
        const queryString = `
            UPDATE
                trisz_thesis.users USERS
            SET
                USERS.last_login_datetime = CURRENT_TIMESTAMP,
                USERS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                USERS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [id]
        );
    }

    async update(userDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.users USERS
            SET
                USERS.name          = ?,
                USERS.password_hash = ?,
                USERS.is_active     = ?,
                USERS.updated_at    = CURRENT_TIMESTAMP
            WHERE
                USERS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                userDo.name,
                userDo.passwordHash,
                userDo.isActive,
                userDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.users
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            WHERE
                id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new UserDo(row);
    }

    async getByEmail(email)
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            WHERE
                USERS.email = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [email]
        );
        
        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new UserDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new UserDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new UserDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                ROLES.name                  AS roleName,
                ROLES.description           AS roleDescription,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            LEFT JOIN
                trisz_thesis.roles ROLES
            ON
                USERS.role_id = ROLES.id
            WHERE
                USERS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new UserDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                ROLES.name                  AS roleName,
                ROLES.description           AS roleDescription,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            LEFT JOIN
                trisz_thesis.roles ROLES
            ON
                USERS.role_id = ROLES.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new UserDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                USERS.id                    AS id,
                USERS.role_id               AS roleId,
                ROLES.name                  AS roleName,
                ROLES.description           AS roleDescription,
                USERS.name                  AS name,
                USERS.email                 AS email,
                USERS.password_hash         AS passwordHash,
                USERS.registration_datetime AS registrationDatetime,
                USERS.last_login_datetime   AS lastLoginDatetime,
                USERS.is_active             AS isActive,
                USERS.created_at            AS createdAt,
                USERS.updated_at            AS updatedAt
            FROM
                trisz_thesis.users USERS
            LEFT JOIN
                trisz_thesis.roles ROLES
            ON
                USERS.role_id = ROLES.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new UserDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.users USERS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = UserDao;