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
const { DescribeParameterEncryptionResultSet1 } = require('tedious/lib/always-encrypted/types');
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
app.use(router);
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));

//Functions

async function login(req, res) {
  let result;
  var {login, password} = req.body;
    try {
      const dbRequest = await request()

      const result = await dbRequest
        .input('Nazwa_Uzytkownika', sql.VarChar(50), login)
        .input('Haslo', sql.VarChar(50), password)
        .query('SELECT Email FROM Uzytkownicy WHERE Nazwa_Uzytkownika = @Nazwa_Uzytkownika AND Haslo = @Haslo')
      if (result.rowsAffected[0] === 1) {
        req.session.userEmail = result.recordset[0];
        req.session.userLogin = login;
        console.log("User", login, "just logged on")
        showItems(req, res);

      } else {
        res.render('login', {title: 'Logownie', error: 'Login lub hasło niepoprawne'})
      }
    } catch (err) {
      res.render('login', {error: 'Error'})
      console.error(err)
    }
}

async function register(req, res) {
  var {login, email, password, name, surname} = req.body

  try{
    const dbRequest = await request()

    const result = await dbRequest
      .input('login', sql.VarChar(50), login)
      .input('email', sql.VarChar(50), email)
      .input('password', sql.VarChar(50), password)
      .input('name', sql.VarChar(50), name)
      .input('surname', sql.VarChar(50), surname)
      .input('money', sql.Money, 0)
      .query(' INSERT INTO Uzytkownicy VALUES (@login, @money, @name, @surname, @email, @password)')
    
    res.render('register', { error: 'Zarejsetrowano poprawnie!'})
    console.log('User', login, 'just joined!!')
  } catch(err){
    console.error('Failed to register user :((', err)
  }
}

async function showItems(req, res) {
  let items = [];
  login = req.session?.userLogin
  rarity = req.query.rarity

  try {
    const dbRequest = await request()
    let result;

    if (req.query.rarity) {
      result = await dbRequest
        .input('rzadkosc', sql.VarChar(30), req.query.rarity)
        .input('oferta', sql.VarChar(30), 'toSell' )
        .query('SELECT * FROM przedmioty WHERE rzadkosc = @rzadkosc AND oferta=@oferta')
      console.log('User', login, 'wants to see all', rarity, 'items!')
      if (result.rowsAffected[0] === 0) {
        res.render('home', {noItem: 'No items with this rarirty...', login: req.session?.userLogin} )
      }
    } else {
      result = await dbRequest
      .input('oferta', sql.VarChar(30), 'toSell' )
      .query('SELECT * FROM przedmioty where oferta=@oferta')
    }

    items = result.recordset
  } catch(err) {
    console.error(err)
  }
  console.log(items)

  res.render('home', { 
    title: 'Lista produktów', 
    items: items, 
    message: res.message, 
    rarity: req.query.rarity,
    login: req.session?.userLogin
   })
}

async function addItem(req, res, next) { //addItem not in use for now
  try {
    const dbRequest = await request()
    await dbRequest
      .input('Nazwa_Przedmiotu', sql.VarChar(50), req.body.name)
      .input('Email_uzytkownika', sql.VarChar(50), req.session?.userEmail)
      .input('Gra', sql.VarChar(50), req.body.game)
      .input('rzadkosc', sql.VarChar(50), req.body.rarity)
      .query('INSERT INTO Przedmioty VALUES (@Nazwa_Przedmiotu, @Email_uzytkownika, @Gra, @rzadkosc)')

    res.message = 'New item succecsfully added'
  } catch (err) {
    console.error('Failed to add item', err)
    console.log(req.session?.userEmail)
  }
}

async function loginPage(req, res) {
  res.render('login', { title: 'Logowanie' })
}
async function registerPage(req, res) {
  res.render('register', { title: 'Rejestracja'})
}
async function logOut(req, res) {
  req.session.destroy();
  res.render('index')
}

//app gets
app.get('/', logOut)
app.get('/register', registerPage);
app.get('/login', loginPage);
app.get('/home/', showItems);
//app.get('/addItem', (req, res) => {
//  res.render('addItem')
//})

//app posts
app.post('/login', login);
app.post('/addItem', addItem);
app.post('/register', register)


//app listen
app.listen(port, (error) =>{
  if(error) throw error
  console.log("App running on port", port)
})

  
