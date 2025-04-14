const AlgorithmDifficultyLevelDo = require('../dos/algorithmDifficultyLevelDo');
const AlgorithmDifficultyLevelDto = require('../dtos/algorithmDifficultyLevelDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AlgorithmDifficultyLevelDao
{
    async create(algorithmDifficultyLevelDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.algorithm_difficulty_levels (name, description) 
            VALUES
                (?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmDifficultyLevelDo.name,
                algorithmDifficultyLevelDo.description
            ]
        );
    }

    async update(algorithmDifficultyLevelDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS 
            SET
                ALGORITHM_DIFFICULTY_LEVELS.name        = ?,
                ALGORITHM_DIFFICULTY_LEVELS.description = ?,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   = ?,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  = CURRENT_TIMESTAMP
            WHERE
                ALGORITHM_DIFFICULTY_LEVELS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmDifficultyLevelDo.name,
                algorithmDifficultyLevelDo.description,
                algorithmDifficultyLevelDo.isActive,
                algorithmDifficultyLevelDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.algorithm_difficulty_levels
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            WHERE
                ALGORITHM_DIFFICULTY_LEVELS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmDifficultyLevelDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmDifficultyLevelDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmDifficultyLevelDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            WHERE
                ALGORITHM_DIFFICULTY_LEVELS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmDifficultyLevelDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmDifficultyLevelDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHM_DIFFICULTY_LEVELS.id          AS id,
                ALGORITHM_DIFFICULTY_LEVELS.name        AS name,
                ALGORITHM_DIFFICULTY_LEVELS.description AS description,
                ALGORITHM_DIFFICULTY_LEVELS.is_active   AS isActive,
                ALGORITHM_DIFFICULTY_LEVELS.created_at  AS createdAt,
                ALGORITHM_DIFFICULTY_LEVELS.updated_at  AS updatedAt
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmDifficultyLevelDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.algorithm_difficulty_levels ALGORITHM_DIFFICULTY_LEVELS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AlgorithmDifficultyLevelDao;