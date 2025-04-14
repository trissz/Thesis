const MultimediaCategoryDo = require('../dos/multimediaCategoryDo');
const MultimediaCategoryDto = require('../dtos/multimediaCategoryDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class MultimediaCategoryDao
{
    async create(multimediaCategoryDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.multimedia_categories (name) 
            VALUES
                (?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                multimediaCategoryDo.name
            ]
        );
    }

    async update(multimediaCategoryDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            SET
                MULTIMEDIA_CATEGORIES.name       = ?,
                MULTIMEDIA_CATEGORIES.is_active  = ?,
                MULTIMEDIA_CATEGORIES.updated_at = CURRENT_TIMESTAMP
            WHERE
                MULTIMEDIA_CATEGORIES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                multimediaCategoryDo.name,
                multimediaCategoryDo.isActive,
                multimediaCategoryDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.multimedia_categories
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            WHERE
                MULTIMEDIA_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new MultimediaCategoryDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new MultimediaCategoryDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new MultimediaCategoryDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            WHERE
                MULTIMEDIA_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new MultimediaCategoryDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new MultimediaCategoryDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                MULTIMEDIA_CATEGORIES.id         AS id,
                MULTIMEDIA_CATEGORIES.name       AS name,
                MULTIMEDIA_CATEGORIES.is_active  AS isActive,
                MULTIMEDIA_CATEGORIES.created_at AS createdAt,
                MULTIMEDIA_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new MultimediaCategoryDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = MultimediaCategoryDao;