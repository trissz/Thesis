const AchievementDo = require('../dos/achievementDo');
const AchievementDto = require('../dtos/achievementDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class AchievementDao
{
    async create(achievementDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.achievements (user_id, category_id, title, description, value, date_awarded) 
            VALUES
                (?, ?, ?, ?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                achievementDo.userId,
                achievementDo.categoryId,
                achievementDo.title,
                achievementDo.description,
                achievementDo.value,
                achievementDo.dateAwarded,
            ]
        );
    }

    async update(achievementDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.achievements ACHIEVEMENTS 
            SET
                ACHIEVEMENTS.user_id      = ?,
                ACHIEVEMENTS.category_id  = ?,
                ACHIEVEMENTS.title        = ?,
                ACHIEVEMENTS.description  = ?,
                ACHIEVEMENTS.value        = ?,
                ACHIEVEMENTS.date_awarded = ?,
                ACHIEVEMENTS.is_active    = ?,
                ACHIEVEMENTS.updated_at   = CURRENT_TIMESTAMP
            WHERE
                ACHIEVEMENTS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                achievementDo.userId,
                achievementDo.categoryId,
                achievementDo.title,
                achievementDo.description,
                achievementDo.value,
                achievementDo.dateAwarded,
                achievementDo.isActive,
                achievementDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.achievements
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id           AS id,
                ACHIEVEMENTS.user_id      AS userId,
                ACHIEVEMENTS.category_id  AS categoryId,
                ACHIEVEMENTS.title        AS title,
                ACHIEVEMENTS.description  AS description,
                ACHIEVEMENTS.value        AS value,
                ACHIEVEMENTS.date_awarded AS dateAwarded,
                ACHIEVEMENTS.is_active    AS isActive,
                ACHIEVEMENTS.created_at   AS createdAt,
                ACHIEVEMENTS.updated_at   AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            WHERE
                ACHIEVEMENTS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AchievementDo(row);
    }

    async getAllByUserId(id)
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id           AS id,
                ACHIEVEMENTS.user_id      AS userId,
                ACHIEVEMENTS.category_id  AS categoryId,
                ACHIEVEMENTS.title        AS title,
                ACHIEVEMENTS.description  AS description,
                ACHIEVEMENTS.value        AS value,
                ACHIEVEMENTS.date_awarded AS dateAwarded,
                ACHIEVEMENTS.is_active    AS isActive,
                ACHIEVEMENTS.created_at   AS createdAt,
                ACHIEVEMENTS.updated_at   AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            WHERE
                ACHIEVEMENTS.user_id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AchievementDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id           AS id,
                ACHIEVEMENTS.user_id      AS userId,
                ACHIEVEMENTS.category_id  AS categoryId,
                ACHIEVEMENTS.title        AS title,
                ACHIEVEMENTS.description  AS description,
                ACHIEVEMENTS.value        AS value,
                ACHIEVEMENTS.date_awarded AS dateAwarded,
                ACHIEVEMENTS.is_active    AS isActive,
                ACHIEVEMENTS.created_at   AS createdAt,
                ACHIEVEMENTS.updated_at   AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AchievementDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id           AS id,
                ACHIEVEMENTS.user_id      AS userId,
                ACHIEVEMENTS.category_id  AS categoryId,
                ACHIEVEMENTS.title        AS title,
                ACHIEVEMENTS.description  AS description,
                ACHIEVEMENTS.value        AS value,
                ACHIEVEMENTS.date_awarded AS dateAwarded,
                ACHIEVEMENTS.is_active    AS isActive,
                ACHIEVEMENTS.created_at   AS createdAt,
                ACHIEVEMENTS.updated_at   AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AchievementDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id             AS id,
                ACHIEVEMENTS.user_id        AS userId,
                USERS.name                  AS userName,
                USERS.email                 AS userEmail,
                ACHIEVEMENTS.category_id    AS categoryId,
                ACHIEVEMENT_CATEGORIES.name AS achievementCategoryName,
                ACHIEVEMENTS.title          AS title,
                ACHIEVEMENTS.description    AS description,
                ACHIEVEMENTS.value          AS value,
                ACHIEVEMENTS.date_awarded   AS dateAwarded,
                ACHIEVEMENTS.is_active      AS isActive,
                ACHIEVEMENTS.created_at     AS createdAt,
                ACHIEVEMENTS.updated_at     AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                ACHIEVEMENTS.user_id = USERS.id
            LEFT JOIN
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            ON
                ACHIEVEMENTS.category_id = ACHIEVEMENT_CATEGORIES.id
            WHERE
                ACHIEVEMENTS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new AchievementDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id             AS id,
                ACHIEVEMENTS.user_id        AS userId,
                USERS.name                  AS userName,
                ACHIEVEMENTS.category_id    AS categoryId,
                ACHIEVEMENT_CATEGORIES.name AS achievementCategoryName,
                ACHIEVEMENTS.title          AS title,
                ACHIEVEMENTS.description    AS description,
                ACHIEVEMENTS.value          AS value,
                ACHIEVEMENTS.date_awarded   AS dateAwarded,
                ACHIEVEMENTS.is_active      AS isActive,
                ACHIEVEMENTS.created_at     AS createdAt,
                ACHIEVEMENTS.updated_at     AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                ACHIEVEMENTS.user_id = USERS.id
            LEFT JOIN
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            ON
                ACHIEVEMENTS.category_id = ACHIEVEMENT_CATEGORIES.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new AchievementDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                ACHIEVEMENTS.id             AS id,
                ACHIEVEMENTS.user_id        AS userId,
                USERS.name                  AS userName,
                ACHIEVEMENTS.category_id    AS categoryId,
                ACHIEVEMENT_CATEGORIES.name AS achievementCategoryName,
                ACHIEVEMENTS.title          AS title,
                ACHIEVEMENTS.description    AS description,
                ACHIEVEMENTS.value          AS value,
                ACHIEVEMENTS.date_awarded   AS dateAwarded,
                ACHIEVEMENTS.is_active      AS isActive,
                ACHIEVEMENTS.created_at     AS createdAt,
                ACHIEVEMENTS.updated_at     AS updatedAt
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                ACHIEVEMENTS.user_id = USERS.id
            LEFT JOIN
                trisz_thesis.achievement_categories ACHIEVEMENT_CATEGORIES
            ON
                ACHIEVEMENTS.category_id = ACHIEVEMENT_CATEGORIES.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new AchievementDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.achievements ACHIEVEMENTS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = AchievementDao;