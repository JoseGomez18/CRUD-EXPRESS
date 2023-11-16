const mysql = require('mysql2/promise')

class Conexión {
    constructor(host, user, pass, db) {
        this.host = host,
            this.user = user,
            this.pass = pass,
            this.db = db
    }

    async connect() {
        const connection = await mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.pass,
            database: this.db
        })
        return connection;
    }
}

module.exports = Conexión