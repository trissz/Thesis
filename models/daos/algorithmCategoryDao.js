const AlgorithmCategoryDo = require('../dos/algorithmCategoryDo');
const AlgorithmCategoryDto = require('../dtos/algorithmCategoryDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AlgorithmCategoryDao
{
    async create(algorithmCategoryDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.algorithm_categories (name)
            VALUES
                (?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmCategoryDo.name,
            ]
        );
    }

    async update(algorithmCategoryDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            SET
                ALGORITHM_CATEGORIES.name        = ?,
                ALGORITHM_CATEGORIES.is_active   = ?,
                ALGORITHM_CATEGORIES.updated_at  = CURRENT_TIMESTAMP
            WHERE
                ALGORITHM_CATEGORIES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmCategoryDo.name,
                algorithmCategoryDo.isActive,
                algorithmCategoryDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.algorithm_categories
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            WHERE
                ALGORITHM_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmCategoryDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmCategoryDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmCategoryDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            WHERE
                ALGORITHM_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmCategoryDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmCategoryDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                ALGORITHM_CATEGORIES.id          AS id,
                ALGORITHM_CATEGORIES.name        AS name,
                ALGORITHM_CATEGORIES.is_active   AS isActive,
                ALGORITHM_CATEGORIES.created_at  AS createdAt,
                ALGORITHM_CATEGORIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmCategoryDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.algorithm_categories ALGORITHM_CATEGORIES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AlgorithmCategoryDao;