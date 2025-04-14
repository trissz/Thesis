const TaskDo = require('../dos/taskDo');
const TaskDto = require('../dtos/taskDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class TaskDao
{
    async create(taskDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.tasks (type_id, difficulty_level_id, content, answer, elements, hints) 
            VALUES
                (?, ?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskDo.typeId,
                taskDo.difficultyLevelId,
                taskDo.content,
                taskDo.answer,
                taskDo.elements,
                taskDo.hints
            ]
        );
    }

    async update(taskDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.tasks TASKS 
            SET
                TASKS.type_id             = ?,
                TASKS.difficulty_level_id = ?,
                TASKS.content             = ?,
                TASKS.answer              = ?,
                TASKS.elements            = ?,
                TASKS.hints               = ?,
                TASKS.is_active           = ?,
                TASKS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                TASKS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                taskDo.typeId,
                taskDo.difficultyLevelId,
                taskDo.content,
                taskDo.answer,
                taskDo.elements,
                taskDo.hints,
                taskDo.isActive,
                taskDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.tasks
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                TASKS.id                  AS id,
                TASKS.type_id             AS typeId,
                TASKS.difficulty_level_id AS difficultyLevelId,
                TASKS.content             AS content,
                TASKS.answer              AS answer,
                TASKS.elements            AS elements,
                TASKS.hints               AS hints,
                TASKS.is_active           AS isActive,
                TASKS.created_at          AS createdAt,
                TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
            WHERE
                TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                TASKS.id                  AS id,
                TASKS.type_id             AS typeId,
                TASKS.difficulty_level_id AS difficultyLevelId,
                TASKS.content             AS content,
                TASKS.answer              AS answer,
                TASKS.elements            AS elements,
                TASKS.hints               AS hints,
                TASKS.is_active           AS isActive,
                TASKS.created_at          AS createdAt,
                TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TASKS.id                  AS id,
                TASKS.type_id             AS typeId,
                TASKS.difficulty_level_id AS difficultyLevelId,
                TASKS.content             AS content,
                TASKS.answer              AS answer,
                TASKS.elements            AS elements,
                TASKS.hints               AS hints,
                TASKS.is_active           AS isActive,
                TASKS.created_at          AS createdAt,
                TASKS.updated_at          AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                TASKS.id                    AS id,
                TASKS.type_id               AS typeId,
                TASK_TYPES.name             AS taskTypeName,
                TASKS.difficulty_level_id   AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name AS taskDifficultyLevelName,
                TASKS.content               AS content,
                TASKS.answer                AS answer,
                TASKS.elements              AS elements,
                TASKS.hints                 AS hints,
                TASKS.is_active             AS isActive,
                TASKS.created_at            AS createdAt,
                TASKS.updated_at            AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LEFT JOIN
                trisz_thesis.task_types TASK_TYPES
            ON
                TASKS.type_id = TASK_TYPES.id
            WHERE
                TASKS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TaskDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                TASKS.id                    AS id,
                TASKS.type_id               AS typeId,
                TASK_TYPES.name             AS taskTypeName,
                TASKS.difficulty_level_id   AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name AS taskDifficultyLevelName,
                TASKS.content               AS content,
                TASKS.answer                AS answer,
                TASKS.elements              AS elements,
                TASKS.hints                 AS hints,
                TASKS.is_active             AS isActive,
                TASKS.created_at            AS createdAt,
                TASKS.updated_at            AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LEFT JOIN
                trisz_thesis.task_types TASK_TYPES
            ON
                TASKS.type_id = TASK_TYPES.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TaskDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                TASKS.id                    AS id,
                TASKS.type_id               AS typeId,
                TASK_TYPES.name             AS taskTypeName,
                TASKS.difficulty_level_id   AS difficultyLevelId,
                TASK_DIFFICULTY_LEVELS.name AS taskDifficultyLevelName,
                TASKS.content               AS content,
                TASKS.answer                AS answer,
                TASKS.elements              AS elements,
                TASKS.hints                 AS hints,
                TASKS.is_active             AS isActive,
                TASKS.created_at            AS createdAt,
                TASKS.updated_at            AS updatedAt
            FROM
                trisz_thesis.tasks TASKS
            LEFT JOIN
                trisz_thesis.task_difficulty_levels TASK_DIFFICULTY_LEVELS
            ON
                TASKS.difficulty_level_id = TASK_DIFFICULTY_LEVELS.id
            LEFT JOIN
                trisz_thesis.task_types TASK_TYPES
            ON
                TASKS.type_id = TASK_TYPES.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TaskDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.tasks TASKS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = TaskDao;