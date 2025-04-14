const SelectBasedTaskDo = require('../dos/selectBasedTaskDo');
const SelectBasedTaskDto = require('../dtos/selectBasedTaskDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class SelectBasedTaskDao
{
    async create(selectBasedTaskDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.select_based_tasks (difficulty_level_id, content, answer, options, hints) 
            VALUES
                (?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                selectBasedTaskDo.difficultyLevelId,
                selectBasedTaskDo.content,
                selectBasedTaskDo.answer,
                selectBasedTaskDo.options,
                selectBasedTaskDo.hints
            ]
        );
    }

    async update(selectBasedTaskDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS 
            SET
                SELECT_BASED_TASKS.difficulty_level_id = ?,
                SELECT_BASED_TASKS.content             = ?,
                SELECT_BASED_TASKS.answer              = ?,
                SELECT_BASED_TASKS.options             = ?,
                SELECT_BASED_TASKS.hints               = ?,
                SELECT_BASED_TASKS.is_active           = ?,
                SELECT_BASED_TASKS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                SELECT_BASED_TASKS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                selectBasedTaskDo.difficultyLevelId,
                selectBasedTaskDo.content,
                selectBasedTaskDo.answer,
                selectBasedTaskDo.options,
                selectBasedTaskDo.hints,
                selectBasedTaskDo.isActive,
                selectBasedTaskDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.select_based_tasks
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
            WHERE
                SELECT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new SelectBasedTaskDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new SelectBasedTaskDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new SelectBasedTaskDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name            AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description     AS taskDifficultyLevelDescription,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SELECT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            WHERE
                SELECT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new SelectBasedTaskDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name            AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description     AS taskDifficultyLevelDescription,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SELECT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new SelectBasedTaskDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                SELECT_BASED_TASKS.id                  AS id,
                SELECT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name            AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description     AS taskDifficultyLevelDescription,
                SELECT_BASED_TASKS.content             AS content,
                SELECT_BASED_TASKS.answer              AS answer,
                SELECT_BASED_TASKS.options             AS options,
                SELECT_BASED_TASKS.hints               AS hints,
                SELECT_BASED_TASKS.is_active           AS isActive,
                SELECT_BASED_TASKS.created_at          AS createdAt,
                SELECT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SELECT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new SelectBasedTaskDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.select_based_tasks SELECT_BASED_TASK
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = SelectBasedTaskDao;