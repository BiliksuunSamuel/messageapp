require('dotenv').config();
const mysql = require('mysql');
const connectionstring = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
};

const con = mysql.createConnection(connectionstring, (error) => {
    if (error) throw error;
})
con.connect(() => {
    console.log('DataBase Connected');

})
module.exports = con;