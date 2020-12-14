const express = require('express');
const fs = require('fs');
const router = express.Router()
const database = require('./databases')
const path = require('path');

router.get('/', (req, res)=>{
    res.render('add_data', { warning: 'false'})
})

const capitalize = (string) => {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }

router.post('/', (req, res)=>{
    const filesList = req.files.choose;
    let nameName = capitalize(req.body.name);
    // nameName = nameName.toUpperCase()
    let query = `SELECT * FROM faces WHERE name='${nameName}'`;
    database.query(query, (opt, rows, fields)=>{
        console.log(rows.length)
        let j=0;
        const actualPath = path.join(__dirname, '../statics/labeled_images');
        if (rows.length == 0){
            
            fs.mkdir(`${actualPath}/${nameName}`, (err)=>{
                if (err){
                    res.render('add_data', { warning: j })
                }else{
                    query = `INSERT INTO faces VALUES('${null}','${nameName}')`;
                    database.query(query, (opt, rows, fields)=>{
                        console.log(rows.length)
                    })
                    for (let i = 0; i < filesList.length; i++){
                        if (filesList[i].mimetype == 'image/jpeg'){
                             if (j != 2){
                                 filesList[i].mv(`${actualPath}/${nameName}/${i+1}.jpg`, (err)=>{
                                     if (err){
                                         console.log(err);
                                     }else{
                                         console.log('No Error');
                                     }
                                 })
                                 j++;
                             }
                        }
                    }
                    res.render('add_data', { warning: j })
                }
            })

        }else{
            for (let i = 0; i < filesList.length; i++){
                if (filesList[i].mimetype == 'image/jpeg'){
                     if (j != 2){
                         filesList[i].mv(`${actualPath}/${nameName}/${i+1}.jpg`, (err)=>{
                             if (err){
                                 console.log(err);
                             }else{
                                 console.log('No Error');
                             }
                         })
                         j++;
                     }
                }
            }
            res.render('add_data', { warning: j })
        }
    })
    console.log(nameName)

})

module.exports = router