// app modules and identifiers
const express = require('express');
const app = express();
const hbs = require('express-handlebars')
const path = require('path');
const router = express.Router();
const session = require('express-session');
const req = require('express/lib/request');
const { request } = require('./database');
const bodyParser = require('body-parser');
const sql = require('mssql');
//const logger = require('morgan');
const port = 5500

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: 'iLoveSql',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));

//Functions

async function showItems(req, res) {
  let items = []

  try {
    const dbRequest = await request()
    let result;

    if (req.query.rarity) {
      result = await dbRequest
        .input('rzadkosc', sql.VarChar(30), req.query.rarity)
        .query('SELECT * FROM przedmioty WHERE rzadkosc = @rzadkosc')
      console.log(req.query.rarity)
    } else {
      result = await dbRequest.query('SELECT * FROM przedmioty')
    }

    items = result.recordset
  } catch(err) {
    console.error(err)
  }
  console.log(items)

  /* Rendering the home page with the items from the database. */
  res.render('home', { 
    title: 'Lista produktów', 
    //name = 
    items: items, 
    message: res.message, 
    rarity: req.query.rarity,
    login: req.session?.userLogin
   })
}

async function login(req, res) {
    var {login, password} = req.body;
      try {
        const dbRequest = await request()
        const result = await dbRequest
          .input('Nazwa_Uzytkownika', sql.VarChar(50), login)
          .input('Haslo', sql.VarChar(50), password)
          .query('SELECT * FROM Uzytkownicy WHERE Nazwa_Uzytkownika = @Nazwa_Uzytkownika AND Haslo = @Haslo')
        if (result.rowsAffected[0] === 1) {
          req.session.userLogin = login;
          //res.render('home', {login: req.session.userLogin})
          console.log("User", login, "just logged on")
          showItems(req, res)
        } else {
          res.render('login', {title: 'Logownie', error: 'Login lub hasło niepoprawne'})
        }
      } catch (err) {
        res.render('login', {error: 'Error'})
        console.error(err)
      }
}

async function loginPage(req, res) {
  res.render('login', { title: 'Logowanie' })
}

//app get routing

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/login', loginPage);
app.get('/home', showItems);
app.post('/login', login);

//app listen

app.listen(port, (error) =>{
  if(error) throw error
  console.log("App running on port", port)
})

  
