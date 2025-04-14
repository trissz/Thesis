const AlgorithmImplementationDo = require('../dos/algorithmImplementationDo');
const AlgorithmImplementationDto = require('../dtos/algorithmImplementationDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AlgorithmImplementationDao
{
    async create(algorithmImplementationDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.algorithm_implementations (algorithm_id, code_language_id, complexity_id, name, description, code) 
            VALUES
                (?, ?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmImplementationDo.algorithmId,
                algorithmImplementationDo.codeLanguageId,
                algorithmImplementationDo.complexityId,
                algorithmImplementationDo.name,
                algorithmImplementationDo.description,
                algorithmImplementationDo.code
            ]
        );
    }

    async update(algorithmImplementationDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS 
            SET
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     = ?,
                ALGORITHM_IMPLEMENTATIONS.code_language_id = ?,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    = ?,
                ALGORITHM_IMPLEMENTATIONS.name             = ?,
                ALGORITHM_IMPLEMENTATIONS.description      = ?,
                ALGORITHM_IMPLEMENTATIONS.code             = ?,
                ALGORITHM_IMPLEMENTATIONS.is_active        = ?,
                ALGORITHM_IMPLEMENTATIONS.updated_at       = CURRENT_TIMESTAMP
            WHERE
                ALGORITHM_IMPLEMENTATIONS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                algorithmImplementationDo.algorithmId,
                algorithmImplementationDo.codeLanguageId,
                algorithmImplementationDo.complexityId,
                algorithmImplementationDo.name,
                algorithmImplementationDo.description,
                algorithmImplementationDo.code,
                algorithmImplementationDo.isActive,
                algorithmImplementationDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.algorithm_implementations
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            WHERE
                ALGORITHM_IMPLEMENTATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmImplementationDo(row);
    }

    async getAllByAlgorithmId(algorithmId)
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            WHERE
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [algorithmId]
        );

        return rows.map(row => new AlgorithmImplementationDo(row));
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmImplementationDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmImplementationDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHMS.name                            AS algorithmName,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                CODE_LANGUAGES.name                        AS codeLanguageName,
                CODE_LANGUAGES.notation                    AS codeLanguageNotation,
                CODE_LANGUAGES.key_string                  AS codeLanguageKeyString,
                CODE_LANGUAGES.description                 AS codeLanguageDescription,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_COMPLEXITIES.name                AS algorithmComplexityName,
                ALGORITHM_COMPLEXITIES.notation            AS algorithmComplexityNotation,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            LEFT JOIN
                trisz_thesis.algorithms ALGORITHMS
            ON
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ALGORITHMS.id
            LEFT JOIN
                trisz_thesis.code_languages CODE_LANGUAGES
            ON
                ALGORITHM_IMPLEMENTATIONS.code_language_id = CODE_LANGUAGES.id
            LEFT JOIN
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            ON
                ALGORITHM_IMPLEMENTATIONS.complexity_id = ALGORITHM_COMPLEXITIES.id
            WHERE
                ALGORITHM_IMPLEMENTATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AlgorithmImplementationDto(row);
    }

    async getDetailedAllByAlgorithmId(algorithmId)
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHMS.name                            AS algorithmName,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                CODE_LANGUAGES.name                        AS codeLanguageName,
                CODE_LANGUAGES.notation                    AS codeLanguageNotation,
                CODE_LANGUAGES.key_string                  AS codeLanguageKeyString,
                CODE_LANGUAGES.description                 AS codeLanguageDescription,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_COMPLEXITIES.name                AS algorithmComplexityName,
                ALGORITHM_COMPLEXITIES.notation            AS algorithmComplexityNotation,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            LEFT JOIN
                trisz_thesis.algorithms ALGORITHMS
            ON
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ALGORITHMS.id
            LEFT JOIN
                trisz_thesis.code_languages CODE_LANGUAGES
            ON
                ALGORITHM_IMPLEMENTATIONS.code_language_id = CODE_LANGUAGES.id
            LEFT JOIN
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            ON
                ALGORITHM_IMPLEMENTATIONS.complexity_id = ALGORITHM_COMPLEXITIES.id
            WHERE
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [algorithmId]
        );
        
        return rows.map(row => new AlgorithmImplementationDto(row));
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHMS.name                            AS algorithmName,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                CODE_LANGUAGES.name                        AS codeLanguageName,
                CODE_LANGUAGES.notation                    AS codeLanguageNotation,
                CODE_LANGUAGES.key_string                  AS codeLanguageKeyString,
                CODE_LANGUAGES.description                 AS codeLanguageDescription,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_COMPLEXITIES.name                AS algorithmComplexityName,
                ALGORITHM_COMPLEXITIES.notation            AS algorithmComplexityNotation,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            LEFT JOIN
                trisz_thesis.algorithms ALGORITHMS
            ON
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ALGORITHMS.id
            LEFT JOIN
                trisz_thesis.code_languages CODE_LANGUAGES
            ON
                ALGORITHM_IMPLEMENTATIONS.code_language_id = CODE_LANGUAGES.id
            LEFT JOIN
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            ON
                ALGORITHM_IMPLEMENTATIONS.complexity_id = ALGORITHM_COMPLEXITIES.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AlgorithmImplementationDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
           SELECT
                ALGORITHM_IMPLEMENTATIONS.id               AS id,
                ALGORITHM_IMPLEMENTATIONS.algorithm_id     AS algorithmId,
                ALGORITHMS.name                            AS algorithmName,
                ALGORITHM_IMPLEMENTATIONS.code_language_id AS codeLanguageId,
                CODE_LANGUAGES.name                        AS codeLanguageName,
                CODE_LANGUAGES.notation                    AS codeLanguageNotation,
                CODE_LANGUAGES.key_string                  AS codeLanguageKeyString,
                CODE_LANGUAGES.description                 AS codeLanguageDescription,
                ALGORITHM_IMPLEMENTATIONS.complexity_id    AS complexityId,
                ALGORITHM_COMPLEXITIES.name                AS algorithmComplexityName,
                ALGORITHM_COMPLEXITIES.notation            AS algorithmComplexityNotation,
                ALGORITHM_IMPLEMENTATIONS.name             AS name,
                ALGORITHM_IMPLEMENTATIONS.description      AS description,
                ALGORITHM_IMPLEMENTATIONS.code             AS code,
                ALGORITHM_IMPLEMENTATIONS.is_active        AS isActive,
                ALGORITHM_IMPLEMENTATIONS.created_at       AS createdAt,
                ALGORITHM_IMPLEMENTATIONS.updated_at       AS updatedAt
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
            LEFT JOIN
                trisz_thesis.algorithms ALGORITHMS
            ON
                ALGORITHM_IMPLEMENTATIONS.algorithm_id = ALGORITHMS.id
            LEFT JOIN
                trisz_thesis.code_languages CODE_LANGUAGES
            ON
                ALGORITHM_IMPLEMENTATIONS.code_language_id = CODE_LANGUAGES.id
            LEFT JOIN
                trisz_thesis.algorithm_complexities ALGORITHM_COMPLEXITIES
            ON
                ALGORITHM_IMPLEMENTATIONS.complexity_id = ALGORITHM_COMPLEXITIES.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AlgorithmImplementationDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.algorithm_implementations ALGORITHM_IMPLEMENTATIONS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AlgorithmImplementationDao;