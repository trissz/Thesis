const InputBasedTaskDo = require('../dos/inputBasedTaskDo');
const InputBasedTaskDto = require('../dtos/inputBasedTaskDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class InputBasedTaskDao
{
    async create(inputBasedTaskDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.input_based_tasks (difficulty_level_id, content, answer, hints) 
            VALUES
                (?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                inputBasedTaskDo.difficultyLevelId,
                inputBasedTaskDo.content,
                inputBasedTaskDo.answer,
                inputBasedTaskDo.hints
            ]
        );
    }

    async update(inputBasedTaskDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS 
            SET
                INPUT_BASED_TASKS.difficulty_level_id = ?,
                INPUT_BASED_TASKS.content             = ?,
                INPUT_BASED_TASKS.answer              = ?,
                INPUT_BASED_TASKS.hints               = ?,
                INPUT_BASED_TASKS.is_active           = ?,
                INPUT_BASED_TASKS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                INPUT_BASED_TASKS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                inputBasedTaskDo.difficultyLevelId,
                inputBasedTaskDo.content,
                inputBasedTaskDo.answer,
                inputBasedTaskDo.hints,
                inputBasedTaskDo.isActive,
                inputBasedTaskDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.input_based_tasks
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
            WHERE
                INPUT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new InputBasedTaskDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new InputBasedTaskDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new InputBasedTaskDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name           AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description    AS taskDifficultyLevelDescription,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                INPUT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            WHERE
                INPUT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new InputBasedTaskDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name           AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description    AS taskDifficultyLevelDescription,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                INPUT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new InputBasedTaskDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                INPUT_BASED_TASKS.id                  AS id,
                INPUT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name           AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description    AS taskDifficultyLevelDescription,
                INPUT_BASED_TASKS.content             AS content,
                INPUT_BASED_TASKS.answer              AS answer,
                INPUT_BASED_TASKS.hints               AS hints,
                INPUT_BASED_TASKS.is_active           AS isActive,
                INPUT_BASED_TASKS.created_at          AS createdAt,
                INPUT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                INPUT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new InputBasedTaskDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.input_based_tasks INPUT_BASED_TASKS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = InputBasedTaskDao;