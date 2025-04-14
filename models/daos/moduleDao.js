const ModuleDo = require('../dos/moduleDo');
const ModuleDto = require('../dtos/moduleDto');
const LessonDo = require('../dos/lessonDo');
const LessonDto = require('../dtos/lessonDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class ModuleDao
{
    async create(moduleDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.modules (title, description)
            VALUES
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                moduleDo.title,
                moduleDo.description
            ]
        );
    }

    async update(moduleDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.modules MODULES 
            SET
                MODULES.title       = ?,
                MODULES.description = ?,
                MODULES.is_active   = ?,
                MODULES.updated_at  = CURRENT_TIMESTAMP
            WHERE
                MODULES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                moduleDo.title,
                moduleDo.description,
                moduleDo.isActive,
                moduleDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.modules
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }   

    async getById(id)
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
            WHERE
                MODULES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new ModuleDo(row);
    }

    async getAllLessonById(id)
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
            INNER JOIN
                trisz_thesis.modules MODULES
            ON
                LESSONS.module_id = MODULES.id
            WHERE
                MODULES.id = ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [id]);
        return rows.map(row => new LessonDo(row));
    }

    async getAll()
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new ModuleDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new ModuleDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
            WHERE
                MODULES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new ModuleDto(row);
    }

    async getDetailedAllLessonById(id)
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
    
        const [rows] = await databaseConnectionBo.query(queryString, [id]);
        return rows.map(row => new LessonDto(row));
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new ModuleDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                MODULES.id          AS id,
                MODULES.title       AS title,
                MODULES.description AS description,
                MODULES.is_active   AS isActive,
                MODULES.created_at  AS createdAt,
                MODULES.updated_at  AS updatedAt
            FROM
                trisz_thesis.modules MODULES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new ModuleDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.modules MODULES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = ModuleDao;