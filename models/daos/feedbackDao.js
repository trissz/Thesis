const FeedbackDo = require('../dos/feedbackDo');
const FeedbackDto = require('../dtos/feedbackDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class FeedbackDao
{
    async create(feedbackDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.feedback (user_id, topic, content) 
            VALUES
                (?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                feedbackDo.userId,
                feedbackDo.topic,
                feedbackDo.content
            ]
        );
    }

    async update(feedbackDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.feedback FEEDBACK 
            SET
                FEEDBACK.user_id    = ?,
                FEEDBACK.topic      = ?,
                FEEDBACK.content    = ?,
                FEEDBACK.is_active  = ?,
                FEEDBACK.updated_at = CURRENT_TIMESTAMP
            WHERE
                FEEDBACK.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                feedbackDo.userId,
                feedbackDo.topic,
                feedbackDo.content,
                feedbackDo.isActive,
                feedbackDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.feedback
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                FEEDBACK.subject    AS subject,
                FEEDBACK.text       AS text,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
            WHERE
                FEEDBACK.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new FeedbackDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                FEEDBACK.topic      AS topic,
                FEEDBACK.content    AS content,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new FeedbackDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                FEEDBACK.topic      AS topic,
                FEEDBACK.content    AS content,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new FeedbackDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                USERS.name          AS userName,
                USERS.email         AS userEmail,
                FEEDBACK.subject    AS subject,
                FEEDBACK.text       AS text,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                FEEDBACK.user_id = USERS.id
            WHERE
                FEEDBACK.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new FeedbackDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                USERS.name          AS userName,
                USERS.email         AS userEmail,
                FEEDBACK.subject    AS subject,
                FEEDBACK.text       AS text,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                FEEDBACK.user_id = USERS.id
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new FeedbackDto(row));
    }

    async getDetailedPaginated(limit, offset) 
    {
        const queryString = `
            SELECT
                FEEDBACK.id         AS id,
                FEEDBACK.user_id    AS userId,
                USERS.name          AS userName,
                USERS.email         AS userEmail,
                FEEDBACK.subject    AS subject,
                FEEDBACK.text       AS text,
                FEEDBACK.is_active  AS isActive,
                FEEDBACK.created_at AS createdAt,
                FEEDBACK.updated_at AS updatedAt
            FROM
                trisz_thesis.feedback FEEDBACK
            LEFT JOIN
                trisz_thesis.users USERS
            ON
                FEEDBACK.user_id = USERS.id
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new FeedbackDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.feedback FEEDBACK
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = FeedbackDao;