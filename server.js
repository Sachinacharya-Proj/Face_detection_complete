// Server generated | Essentials
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const app = express();

const index = require('./routers/index');
const addData = require('./routers/add_data');

app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/statics`));

// app.use(fileUpload)

app.set('view engine', 'ejs');

app.use('/', index);
app.use('/add_data', addData)

const Port = process.env.PORT || 3000;
app.listen(Port, (err) => {
    if (err) {
       console.log(err)
   } else {
       console.log(`Server listening at http://localhost:${Port}`);
    }
});