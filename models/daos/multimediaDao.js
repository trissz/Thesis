const MultimediaDo = require('../dos/multimediaDo');
const MultimediaDto = require('../dtos/multimediaDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class MultimediaDao
{
    async create(multimediaDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.multimedia (category_id, file_name, file_path, file_type, file_size) 
            VALUES
                (?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                multimediaDo.categoryId,
                multimediaDo.fileName,
                multimediaDo.filePath,
                multimediaDo.fileType,
                multimediaDo.fileSize
            ]
        );
    }
    
    async update(multimediaDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.multimedia MULTIMEDIA
            SET
                MULTIMEDIA.category_id = ?, 
                MULTIMEDIA.file_name   = ?, 
                MULTIMEDIA.file_path   = ?, 
                MULTIMEDIA.file_type   = ?, 
                MULTIMEDIA.file_size   = ?, 
                MULTIMEDIA.is_active   = ?, 
                MULTIMEDIA.updated_at  = CURRENT_TIMESTAMP
            WHERE
                MULTIMEDIA.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                multimediaDo.categoryId,
                multimediaDo.fileName,
                multimediaDo.filePath,
                multimediaDo.fileType,
                multimediaDo.fileSize,
                multimediaDo.isActive,
                multimediaDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.multimedia
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
            WHERE
                MULTIMEDIA.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new MultimediaDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new MultimediaDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new MultimediaDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.name        AS multimediaCategoryName,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
            LEFT JOIN
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            ON
                MULTIMEDIA.user_id = MULTIMEDIA_CATEGORIES.id
            WHERE
                MULTIMEDIA.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new MultimediaDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.name        AS multimediaCategoryName,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
            LEFT JOIN
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            ON
                MULTIMEDIA.user_id = MULTIMEDIA_CATEGORIES.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new MultimediaDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                MULTIMEDIA.id          AS id,
                MULTIMEDIA.category_id AS categoryId,
                MULTIMEDIA.name        AS multimediaCategoryName,
                MULTIMEDIA.file_name   AS fileName,
                MULTIMEDIA.file_path   AS filePath,
                MULTIMEDIA.file_type   AS fileType,
                MULTIMEDIA.file_size   AS fileSize,
                MULTIMEDIA.is_active   AS isActive,
                MULTIMEDIA.created_at  AS createdAt,
                MULTIMEDIA.updated_at  AS updatedAt
            FROM
                trisz_thesis.multimedia MULTIMEDIA
            LEFT JOIN
                trisz_thesis.multimedia_categories MULTIMEDIA_CATEGORIES
            ON
                MULTIMEDIA.user_id = MULTIMEDIA_CATEGORIES.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new MultimediaDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.multimedia MULTIMEDIA
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = MultimediaDao;