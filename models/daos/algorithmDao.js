const AlgorithmDo = require('../dos/algorithmDo');
const AlgorithmDto = require('../dtos/algorithmDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AlgorithmDao
{
    async create(algorithmDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.algorithms (category_id, difficulty_level_id, name)
            VALUES
                (?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmDo.categoryId,
                algorithmDo.difficultyLevelId,
                algorithmDo.name
            ]
        );
    }

    async update(algorithmDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.algorithms ALGORITHMS
            SET
                ALGORITHMS.category_id         = ?,
                ALGORITHMS.difficulty_level_id = ?,
                ALGORITHMS.name                = ?,
                ALGORITHMS.is_active           = ?,
                ALGORITHMS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                ALGORITHMS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmDo.categoryId,
                algorithmDo.difficultyLevelId,
                algorithmDo.name,
                algorithmDo.isActive,
                algorithmDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.algorithms
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                  AS id,
                ALGORITHMS.category_id         AS categoryId,
                ALGORITHMS.difficulty_level_id AS difficultyLevelId,
                ALGORITHMS.name                AS name,
                ALGORITHMS.is_active           AS isActive,
                ALGORITHMS.created_at          AS createdAt,
                ALGORITHMS.updated_at          AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
            WHERE
                ALGORITHMS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                  AS id,
                ALGORITHMS.category_id         AS categoryId,
                ALGORITHMS.difficulty_level_id AS difficultyLevelId,
                ALGORITHMS.name                AS name,
                ALGORITHMS.is_active           AS isActive,
                ALGORITHMS.created_at          AS createdAt,
                ALGORITHMS.updated_at          AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                  AS id,
                ALGORITHMS.category_id         AS categoryId,
                ALGORITHMS.difficulty_level_id AS difficultyLevelId,
                ALGORITHMS.name                AS name,
                ALGORITHMS.is_active           AS isActive,
                ALGORITHMS.created_at          AS createdAt,
                ALGORITHMS.updated_at          AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                    AS id,
                ALGORITHMS.category_id           AS categoryId,
                ALGORITHM_CATEGORIES.name        AS algorithmCategoryName,
                ALGORITHMS.difficulty_level_id   AS difficultyLevelId,
                ALGORITHM_DIFFICULTY_LEVELS.name AS algorithmDifficultyLevelName,
                ALGORITHMS.name                  AS name,
                ALGORITHMS.is_active             AS isActive,
                ALGORITHMS.created_at            AS createdAt,
                ALGORITHMS.updated_at            AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
            LEFT JOIN
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            ON
                ALGORITHMS.category_id = ALGORITHM_CATEGORIES.id
            LEFT JOIN
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            ON
                ALGORITHMS.difficulty_level_id = ALGORITHM_DIFFICULTY_LEVELS.id
            WHERE
                ALGORITHMS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                    AS id,
                ALGORITHMS.category_id           AS categoryId,
                ALGORITHM_CATEGORIES.name        AS algorithmCategoryName,
                ALGORITHMS.difficulty_level_id   AS difficultyLevelId,
                ALGORITHM_DIFFICULTY_LEVELS.name AS algorithmDifficultyLevelName,
                ALGORITHMS.name                  AS name,
                ALGORITHMS.is_active             AS isActive,
                ALGORITHMS.created_at            AS createdAt,
                ALGORITHMS.updated_at            AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
            LEFT JOIN
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            ON
                ALGORITHMS.category_id = ALGORITHM_CATEGORIES.id
            LEFT JOIN
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            ON
                ALGORITHMS.difficulty_level_id = ALGORITHM_DIFFICULTY_LEVELS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new SortBaseAlgorithmDtodTaskDo(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                ALGORITHMS.id                    AS id,
                ALGORITHMS.category_id           AS categoryId,
                ALGORITHM_CATEGORIES.name        AS algorithmCategoryName,
                ALGORITHMS.difficulty_level_id   AS difficultyLevelId,
                ALGORITHM_DIFFICULTY_LEVELS.name AS algorithmDifficultyLevelName,
                ALGORITHMS.name                  AS name,
                ALGORITHMS.is_active             AS isActive,
                ALGORITHMS.created_at            AS createdAt,
                ALGORITHMS.updated_at            AS updatedAt
            FROM
                trisz_thesis.algorithms ALGORITHMS
            LEFT JOIN
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            ON
                ALGORITHMS.category_id = ALGORITHM_CATEGORIES.id
            LEFT JOIN
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            ON
                ALGORITHMS.difficulty_level_id = ALGORITHM_DIFFICULTY_LEVELS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.algorithms ALGORITHMS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AlgorithmDao;