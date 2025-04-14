const VisualizationDo = require('../dos/visualizationDo');
const VisualizationDto = require('../dtos/visualizationDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class VisualizationDao
{
    async create(visualizationDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.visualizations (title, description, script_code) 
            VALUES
                (?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                visualizationDo.title,
                visualizationDo.description,
                visualizationDo.scriptCode
            ]
        );
    }

    async update(visualizationDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.visualizations VISUALIZATIONS 
            SET
                VISUALIZATIONS.title       = ?,
                VISUALIZATIONS.description = ?,
                VISUALIZATIONS.script_code = ?,
                VISUALIZATIONS.is_active   = ?,
                VISUALIZATIONS.updated_at  = CURRENT_TIMESTAMP
            WHERE
                VISUALIZATIONS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                visualizationDo.title,
                visualizationDo.description,
                visualizationDo.scriptCode,
                visualizationDo.isActive,
                visualizationDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.visualizations
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
            WHERE
                VISUALIZATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new VisualizationDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new VisualizationDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new VisualizationDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
            WHERE
                VISUALIZATIONS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new VisualizationDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new VisualizationDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                VISUALIZATIONS.id          AS id,
                VISUALIZATIONS.title       AS title,
                VISUALIZATIONS.description AS description,
                VISUALIZATIONS.script_code AS scriptCode,
                VISUALIZATIONS.is_active   AS isActive,
                VISUALIZATIONS.created_at  AS createdAt,
                VISUALIZATIONS.updated_at  AS updatedAt
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new VisualizationDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.visualizations VISUALIZATIONS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = VisualizationDao;