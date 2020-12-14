const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'facedata'
})

connection.connect(err =>{
    if (err){
        console.log('Cannot Connect to Database')
    }else{
        console.log('Connected to Database')
    }
})

module.exports = connection