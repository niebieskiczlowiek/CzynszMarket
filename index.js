// app modules
var express = require('express');
var app = express();
var hbs = require('express-handlebars')
const path = require('path');
var router = express.Router();
const session = require('express-session');
const req = require('express/lib/request')
const { request } = require('./database')
var bodyParser = require('body-parser')
var sql = require('mssql')
var port = 5500


//app settings
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(session({
  secret: 'iLoveSql',
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
    req.session.destroy();
    res.render('index');
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/login', (req, res) => {
    res.render('login')
});
app.post('/login', login);

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

async function login(req, res) {
    var xd = "Siemano"
    var {login, password} = req.body;
    console.log(login, password)
      try {
        const dbRequest = await request()
        const result = await dbRequest
          .input('Nazwa_Uzytkownika', sql.VarChar(50), login)
          .input('Haslo', sql.VarChar(50), password)
          .query('SELECT * FROM Uzytkownicy WHERE Nazwa_Uzytkownika = @Nazwa_Uzytkownika AND Haslo = @Haslo')
        if (result.rowsAffected[0] === 1) {
          req.session.userLogin = login;
          res.render('home', {login: req.session.userLogin})
        } else {
          res.render('login', {title: 'Logownie', error: 'Login lub hasło niepoprawne'})
        }
      } catch (err) {
        res.render('login', {title: 'Zjebałeś ', error: 'Error'})
        console.error(err)
      }
}


async function showItems(req, res) {
// To Do
}

// to clear session data -> req.session.destroy();
  
