const TimeUnitDo = require('../dos/timeUnitDo');
const TimeUnitDto = require('../dtos/timeUnitDto');
const databaseConnectionBo = require('../bos/databaseConnectionBo');

class TimeUnitDao
{
    async create(timeUnitDo)
    {
        const queryString = `
            INSERT INTO
                trisz_thesis.time_units (name, notation, seconds_equivalent) 
            VALUES
                (?, ?, ?)
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                timeUnitDo.name,
                timeUnitDo.notation,
                timeUnitDo.secondsEquivalent
            ]
        );
    }

    async update(timeUnitDo)
    {
        const queryString = `
            UPDATE
                trisz_thesis.time_units TIME_UNITS 
            SET
                TIME_UNITS.name                = ?,
                TIME_UNITS.notation            = ?,
                TIME_UNITS.seconds_equivalent  = ?,
                TIME_UNITS.is_active           = ?,
                TIME_UNITS.updated_at          = CURRENT_TIMESTAMP
            WHERE
                TIME_UNITS.id = ?
        `;

        return await databaseConnectionBo.query(
            queryString,
            [
                timeUnitDo.name,
                timeUnitDo.notation,
                timeUnitDo.secondsEquivalent,
                timeUnitDo.isActive,
                timeUnitDo.id
            ]
        );
    }

    async deleteById(id)
    {
        const queryString = `
            DELETE FROM
                trisz_thesis.time_units
            WHERE
                id = ?
        `;

        return await databaseConnectionBo.query(queryString, [id]);
    }

    async getById(id)
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
            WHERE
                TIME_UNITS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TimeUnitDo(row);
    }

    async getAll()
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TimeUnitDo(row));
    }

    async getPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TimeUnitDo(row));
    }

    async getDetailedById(id)
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
            WHERE
                TIME_UNITS.id = ?
        `;

        const [rows] = await databaseConnectionBo.query(
            queryString,
            [id]
        );

        if ( rows.length === 0 ) return null;
        const row = rows[0];
        return new TimeUnitDto(row);
    }

    async getDetailedAll()
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
        `;

        const [rows] = await databaseConnectionBo.query(queryString);
        return rows.map(row => new TimeUnitDto(row));
    }

    async getDetailedPaginated(limit, offset)
    {
        const queryString = `
            SELECT
                TIME_UNITS.id                 AS id,
                TIME_UNITS.name               AS name,
                TIME_UNITS.notation           AS notation,
                TIME_UNITS.seconds_equivalent AS secondsEquivalent,
                TIME_UNITS.is_active          AS isActive,
                TIME_UNITS.created_at         AS createdAt,
                TIME_UNITS.updated_at         AS updatedAt
            FROM
                trisz_thesis.time_units TIME_UNITS
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        const [rows] = await databaseConnectionBo.query(queryString, [limit, offset]);
        return rows.map(row => new TimeUnitDto(row));
    }

    async getCount()
    {
        const queryString = `
            SELECT
                COUNT(*) AS total
            FROM
                trisz_thesis.time_units TIME_UNITS
        `;

        const [[{ total }]] = await databaseConnectionBo.query(queryString);
        return total;
    }
}

module.exports = TimeUnitDao;