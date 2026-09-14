const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "psychology",
    password: "aj3042J390RJ0F/A",
    port: 5432
});

module.exports = pool;