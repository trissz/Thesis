const AlgorithmComplexityDo = require('../dos/algorithmComplexityDo');
const AlgorithmComplexityDto = require('../dtos/algorithmComplexityDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AlgorithmComplexityDao
{
    async create(algorithmComplexityDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.algorithm_complexities (name, notation)
            VALUES
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmComplexityDo.name,
                algorithmComplexityDo.notation
            ]
        );
    }

    async update(algorithmComplexityDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            SET
                ALGORITHM_COMPLEXITIES.name        = ?,
                ALGORITHM_COMPLEXITIES.notation    = ?,
                ALGORITHM_COMPLEXITIES.is_active   = ?,
                ALGORITHM_COMPLEXITIES.updated_at  = CURRENT_TIMESTAMP
            WHERE
                ALGORITHM_COMPLEXITIES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmComplexityDo.name,
                algorithmComplexityDo.notation,
                algorithmComplexityDo.isActive,
                algorithmComplexityDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.algorithm_complexities
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_COMPLEXITIES.id          AS id,
                ALGORITHM_COMPLEXITIES.name        AS name,
                ALGORITHM_COMPLEXITIES.notation    AS notation,
                ALGORITHM_COMPLEXITIES.is_active   AS isActive,
                ALGORITHM_COMPLEXITIES.created_at  AS createdAt,
                ALGORITHM_COMPLEXITIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            WHERE
                ALGORITHM_COMPLEXITIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmComplexityDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_COMPLEXITIES.id          AS id,
                ALGORITHM_COMPLEXITIES.name        AS name,
                ALGORITHM_COMPLEXITIES.notation    AS notation,
                ALGORITHM_COMPLEXITIES.is_active   AS isActive,
                ALGORITHM_COMPLEXITIES.created_at  AS createdAt,
                ALGORITHM_COMPLEXITIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmComplexityDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHM_COMPLEXITIES.id          AS id,
                ALGORITHM_COMPLEXITIES.name        AS name,
                ALGORITHM_COMPLEXITIES.notation    AS notation,
                ALGORITHM_COMPLEXITIES.is_active   AS isActive,
                ALGORITHM_COMPLEXITIES.created_at  AS createdAt,
                ALGORITHM_COMPLEXITIES.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmComplexityDo(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AlgorithmComplexityDao;