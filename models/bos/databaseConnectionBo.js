const mysql = require('mysql2/promise');
const LogHelper = require('../helpers/logHelper');

class DatabaseConnectionBo
{
    constructor()
    {
        this.pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'trisz_thesis_user',
            password: 'EbX3iCagmauX2VDUeadnohvCrM9t1a6TcFDM8vTUYB2h0d76dg',
            database: 'trisz_thesis',
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        this.checkConnection();
    }

    async query(sql, params)
    {
        const connection = await this.pool.getConnection();

        try
        {
            return await connection.query(sql, params);
        }
        finally
        {
            connection.release();
        }
    }

    async checkConnection()
    {
        try
        {
            const connection = await this.pool.getConnection();
            LogHelper.addMessage('Database connection was successful');
            connection.release();
        }
        catch (error)
        {
            LogHelper.addMessage('Database connection failed:', error.message);
            console.error('Database connection failed:', error.message);
        }
    }
}

module.exports = new DatabaseConnectionBo();