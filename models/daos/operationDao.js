const OperationDo = require('../dos/operationDo');
const OperationDto = require('../dtos/operationDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class OperationDao
{
    async create(operationDo)
    {
        const queryString = `
            INSERT INTO 
                trisz_thesis.operations (name, description) 
            VALUES 
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                operationDo.name,
                operationDo.description
            ]
        );
    }

    async update(operationDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.operations OPERATIONS
            SET
                OPERATIONS.name        = ?,
                OPERATIONS.description = ?,
                OPERATIONS.is_active   = ?,
                OPERATIONS.updated_at  = CURRENT_TIMESTAMP
            WHERE
                OPERATIONS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                operationDo.name,
                operationDo.description,
                operationDo.isActive,
                operationDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.operations
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                OPERATIONS.id         AS id,
                OPERATIONS.name       AS name,
                OPERATIONS.is_active  AS isActive,
                OPERATIONS.created_at AS createdAt,
                OPERATIONS.updated_at AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
            WHERE
                OPERATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new OperationDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                OPERATIONS.id          AS id,
                OPERATIONS.name        AS name,
                OPERATIONS.description AS description,
                OPERATIONS.is_active   AS isActive,
                OPERATIONS.created_at  AS createdAt,
                OPERATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new OperationDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                OPERATIONS.id          AS id,
                OPERATIONS.name        AS name,
                OPERATIONS.description AS description,
                OPERATIONS.is_active   AS isActive,
                OPERATIONS.created_at  AS createdAt,
                OPERATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new OperationDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                OPERATIONS.id         AS id,
                OPERATIONS.name       AS name,
                OPERATIONS.is_active  AS isActive,
                OPERATIONS.created_at AS createdAt,
                OPERATIONS.updated_at AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
            WHERE
                OPERATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new OperationDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                OPERATIONS.id          AS id,
                OPERATIONS.name        AS name,
                OPERATIONS.description AS description,
                OPERATIONS.is_active   AS isActive,
                OPERATIONS.created_at  AS createdAt,
                OPERATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new OperationDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                OPERATIONS.id          AS id,
                OPERATIONS.name        AS name,
                OPERATIONS.description AS description,
                OPERATIONS.is_active   AS isActive,
                OPERATIONS.created_at  AS createdAt,
                OPERATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.operations OPERATIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new OperationDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.operations OPERATIONS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = OperationDao;