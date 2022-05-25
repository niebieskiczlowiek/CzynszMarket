// app requirements
var express = require('express');
var hbs = require('express-handlebars')
var app = express();
var router = express.Router();
const sql = require('mssql')
const req = require('express/lib/request')
const { request } = require('./database')

var query = "SELECT * FROM Uzytkownicy"

// app settings

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/login', (req, res) => {
    res.render('login')
});
app.get('/home', (req, res) => {
    res.render('home')
});
// pod strony ^^

app.listen(port, (error) =>{
    if(error) throw error
    console.log("App running on port", port)
})

//test connection
router.get('/testconnect', function(req, res, next) {
    sql.getdata();
    res.render('index')
});

