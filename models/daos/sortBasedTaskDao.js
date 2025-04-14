const SortBasedTaskDo = require('../dos/sortBasedTaskDo');
const SortBasedTaskDto = require('../dtos/sortBasedTaskDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class SortBasedTaskDao
{
    async create(sortBasedTaskDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.sort_based_tasks (difficulty_level_id, content, answer, elements, hints) 
            VALUES
                (?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                sortBasedTaskDo.difficultyLevelId,
                sortBasedTaskDo.content,
                sortBasedTaskDo.answer,
                sortBasedTaskDo.elements,
                sortBasedTaskDo.hints
            ]
        );
    }

    async update(sortBasedTaskDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS 
            SET
                SORT_BASED_TASKS.difficulty_level_id = ?,
                SORT_BASED_TASKS.content             = ?,
                SORT_BASED_TASKS.answer              = ?,
                SORT_BASED_TASKS.elements            = ?,
                SORT_BASED_TASKS.hints               = ?,
                SORT_BASED_TASKS.is_active           = ?,
                SORT_BASED_TASKS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                SORT_BASED_TASKS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                sortBasedTaskDo.difficultyLevelId,
                sortBasedTaskDo.content,
                sortBasedTaskDo.answer,
                sortBasedTaskDo.elements,
                sortBasedTaskDo.hints,
                sortBasedTaskDo.isActive,
                sortBasedTaskDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.sort_based_tasks
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
            WHERE
                SORT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new SortBasedTaskDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new SortBasedTaskDo(row));
    }

    async getPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new SortBasedTaskDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name          AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description   AS taskDifficultyLevelDescription,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SORT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            WHERE
                SORT_BASED_TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new SortBasedTaskDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name          AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description   AS taskDifficultyLevelDescription,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SORT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new SortBasedTaskDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                SORT_BASED_TASKS.id                  AS id,
                SORT_BASED_TASKS.difficulty_level_id AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name          AS taskDifficultyLevelName,
                TASK_DIFFICULTY_LEVELS.description   AS taskDifficultyLevelDescription,
                SORT_BASED_TASKS.content             AS content,
                SORT_BASED_TASKS.answer              AS answer,
                SORT_BASED_TASKS.elements            AS elements,
                SORT_BASED_TASKS.hints               AS hints,
                SORT_BASED_TASKS.is_active           AS isActive,
                SORT_BASED_TASKS.created_at          AS createdAt,
                SORT_BASED_TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                SORT_BASED_TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new SortBasedTaskDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.sort_based_tasks SORT_BASED_TASKS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = SortBasedTaskDao;