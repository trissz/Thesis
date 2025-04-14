const TaskTypeDo = require('../dos/taskTypeDo');
const TaskTypeDto = require('../dtos/taskTypeDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class TaskTypeDao
{
    async create(taskTypeDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.task_types (name) 
            VALUES
                (?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskTypeDo.name
            ]
        );
    }

    async update(taskTypeDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.task_types TASK_TYPES 
            SET
                TASK_TYPES.name       = ?,
                TASK_TYPES.is_active  = ?,
                TASK_TYPES.updated_at = CURRENT_TIMESTAMP
            WHERE
                TASK_TYPES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskTypeDo.name,
                taskTypeDo.isActive,
                taskTypeDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.task_types
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
            WHERE
                TASK_TYPES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskTypeDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskTypeDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskTypeDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
            WHERE
                TASK_TYPES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskTypeDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskTypeDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TASK_TYPES.id         AS id,
                TASK_TYPES.name       AS name,
                TASK_TYPES.is_active  AS isActive,
                TASK_TYPES.created_at AS createdAt,
                TASK_TYPES.updated_at AS updatedAt
            FROM
                trisz_thesis.task_types TASK_TYPES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskTypeDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.task_types TASK_TYPES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = TaskTypeDao;