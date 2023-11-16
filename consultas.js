const Conexión = require('./Conexion')

class Consultas extends Conexión {
    constructor(host, user, pass, db) {
        super(host, user, pass, db)
    }

    async select(table) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`)
        return rows
    }

    async delete(table, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`DELETE FROM ${table} WHERE ${condition}`)
        return rows
    }

    async insert(table, values) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`INSERT INTO ${table} VALUES ${values}`);
        return rows
    }

    async update(table, values, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`UPDATE ${table} SET ${values} WHERE ${condition}`);
        return rows
    }

    async closeConect() {
        const connection = await this.connect().end
        console.log('se cerro la conexion')
        return connection
    }
}

module.exports = Consultas