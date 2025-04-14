const CodeLanguageDo = require('../dos/codeLanguageDo');
const CodeLanguageDto = require('../dtos/codeLanguageDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class CodeLanguageDao
{
    async create(codeLanguageDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.code_languages (name, notation, key_string, description) 
            VALUES
                (?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                codeLanguageDo.name,
                codeLanguageDo.notation,
                codeLanguageDo.keyString,
                codeLanguageDo.description
            ]
        );
    }

    async update(codeLanguageDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.code_languages CODE_LANGUAGES 
            SET
                CODE_LANGUAGES.name        = ?,
                CODE_LANGUAGES.notation    = ?,
                CODE_LANGUAGES.key_string  = ?,
                CODE_LANGUAGES.description = ?,
                CODE_LANGUAGES.is_active   = ?,
                CODE_LANGUAGES.updated_at  = CURRENT_TIMESTAMP
            WHERE
                CODE_LANGUAGES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                codeLanguageDo.name,
                codeLanguageDo.notation,
                codeLanguageDo.keyString,
                codeLanguageDo.description,
                codeLanguageDo.isActive,
                codeLanguageDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.code_languages
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
            WHERE
                CODE_LANGUAGES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new CodeLanguageDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new CodeLanguageDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new CodeLanguageDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
            WHERE
                CODE_LANGUAGES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new CodeLanguageDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new CodeLanguageDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                CODE_LANGUAGES.id          AS id,
                CODE_LANGUAGES.name        AS name,
                CODE_LANGUAGES.notation    AS notation,
                CODE_LANGUAGES.key_string  AS keyString,
                CODE_LANGUAGES.description AS description,
                CODE_LANGUAGES.is_active   AS isActive,
                CODE_LANGUAGES.created_at  AS createdAt,
                CODE_LANGUAGES.updated_at  AS updatedAt
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new CodeLanguageDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.code_languages CODE_LANGUAGES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = CodeLanguageDao;