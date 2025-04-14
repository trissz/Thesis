const LessonDo = require('../dos/lessonDo');
const LessonDto = require('../dtos/lessonDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class LessonDao
{
    async create(lessonDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.lessons (module_id, time_unit_id, title, content, estimated_time_value) 
            VALUES
                (?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                lessonDo.moduleId,
                lessonDo.timeUnitId,
                lessonDo.title,
                lessonDo.content,
                lessonDo.estimatedTimeValue
            ]
        );
    }

    async update(lessonDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.lessons LESSONS 
            SET
                LESSONS.module_id            = ?,
                LESSONS.time_unit_id         = ?,
                LESSONS.title                = ?,
                LESSONS.content              = ?,
                LESSONS.estimated_time_value = ?,
                LESSONS.is_active            = ?,
                LESSONS.updated_at           = CURRENT_TIMESTAMP
            WHERE
                LESSONS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                lessonDo.moduleId,
                lessonDo.timeUnitId,
                lessonDo.title,
                lessonDo.content,
                lessonDo.estimatedTimeValue,
                lessonDo.isActive,
                lessonDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.lessons
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                LESSONS.id                   AS id,
                LESSONS.module_id            AS moduleId,
                LESSONS.time_unit_id         AS timeUnitId,
                LESSONS.title                AS title,
                LESSONS.content              AS content,
                LESSONS.estimated_time_value AS estimatedTimeValue,
                LESSONS.is_active            AS isActive,
                LESSONS.created_at           AS createdAt,
                LESSONS.updated_at           AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            WHERE
                LESSONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new LessonDo(row);
    }

    async getAllByModuleId(moduleId)
    {
        const queryString = `
            SELECT
                LESSONS.id                   AS id,
                LESSONS.module_id            AS moduleId,
                LESSONS.time_unit_id         AS timeUnitId,
                LESSONS.title                AS title,
                LESSONS.content              AS content,
                LESSONS.estimated_time_value AS estimatedTimeValue,
                LESSONS.is_active            AS isActive,
                LESSONS.created_at           AS createdAt,
                LESSONS.updated_at           AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            WHERE
                LESSONS.module_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(queryString, [moduleId]);
        return rows.map(row => new LessonDo(row));
    }

    async getAll()
    {
        const queryString = `
            SELECT
                LESSONS.id                   AS id,
                LESSONS.module_id            AS moduleId,
                LESSONS.time_unit_id         AS timeUnitId,
                LESSONS.title                AS title,
                LESSONS.content              AS content,
                LESSONS.estimated_time_value AS estimatedTimeValue,
                LESSONS.is_active            AS isActive,
                LESSONS.created_at           AS createdAt,
                LESSONS.updated_at           AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new LessonDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                LESSONS.id                   AS id,
                LESSONS.module_id            AS moduleId,
                LESSONS.time_unit_id         AS timeUnitId,
                LESSONS.title                AS title,
                LESSONS.content              AS content,
                LESSONS.estimated_time_value AS estimatedTimeValue,
                LESSONS.is_active            AS isActive,
                LESSONS.created_at           AS createdAt,
                LESSONS.updated_at           AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new LessonDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                LESSONS.id                    AS id,
                LESSONS.module_id             AS moduleId,
                MODULES.title                 AS moduleTitle,
                MODULES.description           AS moduleDescription,
                LESSONS.time_unit_id          AS timeUnitId,
                TIME_UNITS.name               AS timeUnitName,
                TIME_UNITS.notation           AS timeUnitNotation,
                TIME_UNITS.seconds_equivalent AS timeUnitSecondsEquivalent,
                LESSONS.title                 AS title,
                LESSONS.content               AS content,
                LESSONS.estimated_time_value  AS estimatedTimeValue,
                LESSONS.is_active             AS isActive,
                LESSONS.created_at            AS createdAt,
                LESSONS.updated_at            AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            LEFT JOIN
                trisz_thesis.modules MODULES
            ON
                LESSONS.module_id = MODULES.id
            LEFT JOIN
                trisz_thesis.time_units TIME_UNITS
            ON
                LESSONS.time_unit_id = TIME_UNITS.id
            WHERE
                LESSONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new LessonDto(row);
    }

    async getDetailedAllByModuleId(moduleId)
    {
        const queryString = `
            SELECT
                LESSONS.id                    AS id,
                LESSONS.module_id             AS moduleId,
                MODULES.title                 AS moduleTitle,
                MODULES.description           AS moduleDescription,
                LESSONS.time_unit_id          AS timeUnitId,
                TIME_UNITS.name               AS timeUnitName,
                TIME_UNITS.notation           AS timeUnitNotation,
                TIME_UNITS.seconds_equivalent AS timeUnitSecondsEquivalent,
                LESSONS.title                 AS title,
                LESSONS.content               AS content,
                LESSONS.estimated_time_value  AS estimatedTimeValue,
                LESSONS.is_active             AS isActive,
                LESSONS.created_at            AS createdAt,
                LESSONS.updated_at            AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            LEFT JOIN
                trisz_thesis.modules MODULES
            ON
                LESSONS.module_id = MODULES.id
            LEFT JOIN
                trisz_thesis.time_units TIME_UNITS
            ON
                LESSONS.time_unit_id = TIME_UNITS.id
            WHERE
                LESSONS.module_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(queryString, [moduleId]);
        return rows.map(row => new LessonDto(row));
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                LESSONS.id                    AS id,
                LESSONS.module_id             AS moduleId,
                MODULES.title                 AS moduleTitle,
                MODULES.description           AS moduleDescription,
                LESSONS.time_unit_id          AS timeUnitId,
                TIME_UNITS.name               AS timeUnitName,
                TIME_UNITS.notation           AS timeUnitNotation,
                TIME_UNITS.seconds_equivalent AS timeUnitSecondsEquivalent,
                LESSONS.title                 AS title,
                LESSONS.content               AS content,
                LESSONS.estimated_time_value  AS estimatedTimeValue,
                LESSONS.is_active             AS isActive,
                LESSONS.created_at            AS createdAt,
                LESSONS.updated_at            AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            LEFT JOIN
                trisz_thesis.modules MODULES
            ON
                LESSONS.module_id = MODULES.id
            LEFT JOIN
                trisz_thesis.time_units TIME_UNITS
            ON
                LESSONS.time_unit_id = TIME_UNITS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new LessonDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                LESSONS.id                    AS id,
                LESSONS.module_id             AS moduleId,
                MODULES.title                 AS moduleTitle,
                MODULES.description           AS moduleDescription,
                LESSONS.time_unit_id          AS timeUnitId,
                TIME_UNITS.name               AS timeUnitName,
                TIME_UNITS.notation           AS timeUnitNotation,
                TIME_UNITS.seconds_equivalent AS timeUnitSecondsEquivalent,
                LESSONS.title                 AS title,
                LESSONS.content               AS content,
                LESSONS.estimated_time_value  AS estimatedTimeValue,
                LESSONS.is_active             AS isActive,
                LESSONS.created_at            AS createdAt,
                LESSONS.updated_at            AS updatedAt
            FROM
                trisz_thesis.lessons LESSONS
            LEFT JOIN
                trisz_thesis.modules MODULES
            ON
                LESSONS.module_id = MODULES.id
            LEFT JOIN
                trisz_thesis.time_units TIME_UNITS
            ON
                LESSONS.time_unit_id = TIME_UNITS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new LessonDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.lessons LESSONS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = LessonDao;