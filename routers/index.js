const express = require('express');
const router = express.Router()
const database = require('./databases')
router.get('', (req, res)=>{
    let query = 'SELECT * FROM faces';
    database.query(query, (opt, rows, fields)=>{
        res.render('index', { data: rows });
    })
})

module.exports = router