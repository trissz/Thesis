const AchievementCategoryDo = require('../dos/achievementCategoryDo');
const AchievementCategoryDto = require('../dtos/achievementCategoryDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AchievementCategoryDao
{
    async create(achievementCategoryDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.achievement_categories (name) 
            VALUES
                (?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                achievementCategoryDo.name
            ]
        );
    }

    async update(achievementCategoryDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            SET
                ACHIEVEMENT_CATEGORIES.name       = ?,
                ACHIEVEMENT_CATEGORIES.is_active  = ?,
                ACHIEVEMENT_CATEGORIES.updated_at = CURRENT_TIMESTAMP
            WHERE
                ACHIEVEMENT_CATEGORIES.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                achievementCategoryDo.name,
                achievementCategoryDo.isActive,
                achievementCategoryDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.achievement_categories
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            WHERE
                ACHIEVEMENT_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AchievementCategoryDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AchievementCategoryDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AchievementCategoryDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            WHERE
                ACHIEVEMENT_CATEGORIES.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AchievementCategoryDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AchievementCategoryDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ACHIEVEMENT_CATEGORIES.id         AS id,
                ACHIEVEMENT_CATEGORIES.name       AS name,
                ACHIEVEMENT_CATEGORIES.is_active  AS isActive,
                ACHIEVEMENT_CATEGORIES.created_at AS createdAt,
                ACHIEVEMENT_CATEGORIES.updated_at AS updatedAt
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AchievementCategoryDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AchievementCategoryDao;