const TaskDifficultyLevelDo = require('../dos/taskDifficultyLevelDo');
const TaskDifficultyLevelDto = require('../dtos/taskDifficultyLevelDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class TaskDifficultyLevelDao
{
    async create(taskDifficultyLevelDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.task_difficulty_levels (name, description) 
            VALUES
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskDifficultyLevelDo.name,
                taskDifficultyLevelDo.description
            ]
        );
    }

    async update(taskDifficultyLevelDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS 
            SET
                TASK_DIFFICULTY_LEVELS.name        = ?,
                TASK_DIFFICULTY_LEVELS.description = ?,
                TASK_DIFFICULTY_LEVELS.is_active   = ?,
                TASK_DIFFICULTY_LEVELS.updated_at  = CURRENT_TIMESTAMP
            WHERE
                TASK_DIFFICULTY_LEVELS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskDifficultyLevelDo.name,
                taskDifficultyLevelDo.description,
                taskDifficultyLevelDo.isActive,
                taskDifficultyLevelDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.task_difficulty_levels
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            WHERE
                TASK_DIFFICULTY_LEVELS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskDifficultyLevelDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskDifficultyLevelDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskDifficultyLevelDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            WHERE
                TASK_DIFFICULTY_LEVELS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskDifficultyLevelDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskDifficultyLevelDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TASK_DIFFICULTY_LEVELS.id          AS id,
                TASK_DIFFICULTY_LEVELS.name        AS name,
                TASK_DIFFICULTY_LEVELS.description AS description,
                TASK_DIFFICULTY_LEVELS.is_active   AS isActive,
                TASK_DIFFICULTY_LEVELS.created_at  AS createdAt,
                TASK_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskDifficultyLevelDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = TaskDifficultyLevelDao;