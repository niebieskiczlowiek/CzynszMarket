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
        req.session.userEmail = result.recordset[0].Email;
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
  console.log(login, rarity)
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
    items: items, 
    rarity: req.query.rarity,
    login: req.session?.userLogin
   })
}

async function showInventory(req, res) {
  let items = [];
  let login = req.session?.userLogin;
  let email = req.session?.userEmail;

  try {
    const dbRequest = await request()

    const result = await dbRequest
        .input('email', sql.VarChar(50), email)
        .query('SELECT * FROM przedmioty WHERE Email_Uzytkownika = @email')
      if (result.rowsAffected[0] === 0) {
        res.render('inventory', {noItem: 'You have no items in your inventory :((', login: req.session?.userLogin} )
      } 
      items = result.recordset
    } catch(err) {
      console.error(err)
    }

  res.render('inventory', { 
    items: items, 
    login: req.session?.userLogin
   })
}

async function addItem(req, res) {
  var {itemName, owner, game, rarity, price} = req.body
  try {
    const dbRequest = await request()
    var result = await dbRequest
      .input('Nazwa_Przedmiotu', sql.VarChar(50), req.body.itemName)
      .input('Email_uzytkownika', sql.VarChar(50), owner)
      .input('Gra', sql.VarChar(50), req.body.game)
      .input('Rzadkosc', sql.VarChar(50), req.body.rarity)
      .input('Oferta', sql.VarChar(50), 'notToSell')
      .input('Cena', sql.Money, req.body.price)
      .query('INSERT INTO Przedmioty VALUES (@Nazwa_Przedmiotu, @Email_uzytkownika, @Gra, @Rzadkosc, @Oferta, @Cena)')

    if (result.rowsAffected[0] === 1){
      res.render('addItem', { message: 'Succesfully added item'})
    }
  } catch (err) {
    console.error('Failed to add item', err)
  }
}

async function deleteItem(req, res) {
  const ID = req.body.ID
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('DELETE FROM Przedmioty WHERE Id_Przedmiotu = @Id')

    if (result.rowsAffected[0] === 1) {
      res.render('deleteItem', { message: 'Succesfully deleted item with Id' + ID} )
    }
  } catch(err) {
    console.error('Failed to delete item', err)
  }
}

async function showUserProfile(req, res) {
  let data = []
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('login', sql.VarChar(50), req.session?.userLogin)
      .query('SELECT Nazwa_Uzytkownika, Email, Saldo, Imie, Nazwisko FROM Uzytkownicy WHERE Nazwa_Uzytkownika = @login')
      data = result.recordset
    } catch(err) {
      console.error(err)
    }
  res.render('userProfile', { 
    login: req.session?.userLogin,
    data: data,
  })
}

async function checkOwner(req, res) {
  let email = req.session?.userEmail
  console.log("user email:", email)
  let ID = req.body.ID
  let owner = ''
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Email_Uzytkownika FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      owner = result.recordset[0].Email_Uzytkownika
    } catch(err) {
      console.error(err)
    }
  if (email === owner) {
    checkOffer(req, res)
  } else {  
    res.render('sellItem', { message: 'You are not the owner of this item!'})
  }
}

async function checkOffer(req, res) {
  let ID = req.body.ID
  let offer = ''
  try {
    const dbRequest = await request() 

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Oferta FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      offer = result.recordset[0].Oferta
    } catch(err) {
      console.error(err)
    }
  if (offer === 'notToSell') {
    sellItem(req, res)
  } else {
    res.render('sellItem', { message: 'This item is already set to sell !'})
  }
}

async function sellItem(req, res) {
  console.log("user login:", req.session?.userLogin)
  const ID = req.body.ID
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .input('oferta', sql.VarChar(30), 'toSell')
      .query('UPDATE Przedmioty SET Oferta = @oferta WHERE Id_Przedmiotu = @Id') 
    if (result.rowsAffected[0] === 1) {
      res.render('sellItem', { message: 'Succesfully sold item with Id' + ID} )
    }
  } catch(err) {
    console.error('Failed to sell item', err)
  }
}

async function buyItem(req, res) {
  let ID = req.body.ID
  let price = ''
  let buyerSaldo = ''
  let sellerSaldo = ''
  let owner = ''
  let email = req.session?.userEmail
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Cena FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      price = result.recordset[0].Cena
    } catch(err) {
      console.error(err)
    }

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Email', sql.VarChar(50), email)
      .query('SELECT Saldo FROM Uzytkownicy WHERE Email = @Email')
      buyerSaldo = result.recordset[0].Saldo
    } catch(err) {
      console.error(err)
    }

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Email_Uzytkownika FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      owner = result.recordset[0].Email_Uzytkownika
    } catch(err) {
      console.error(err)     
  }

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Email', sql.VarChar(50), owner)
      .query('SELECT Saldo FROM Uzytkownicy WHERE Email = @Email')
      sellerSaldo = result.recordset[0].Saldo
    } catch(err) {
      console.error(err)
  }

  try {
    const dbRequest = await request()
    
    const result = await dbRequest
      .input('Email', sql.VarChar(50), email)
      .input('Saldo', sql.Money, buyerSaldo - price)
      .query('UPDATE Uzytkownicy SET Saldo = @Saldo WHERE Email = @Email')
    } catch(err) {
      console.error(err)
    }

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .input('Saldo', sql.VarChar(50), sellerSaldo + price)
      .input('Email', sql.VarChar(50), owner)
      .query('UPDATE Uzytkownicy SET Saldo = @Saldo WHERE Email = @Email')
    } catch(err) {
      console.error(err)
    }
  res.render('buyItem', { message: 'Succesfully bought item with Id' + ID} )
}


async function checkIfNotOwner(req, res) {
  let email = req.session?.userEmail
  let ID = req.body.ID
  let owner = ''
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Email_Uzytkownika FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      owner = result.recordset[0].Email_Uzytkownika
    } catch(err) {
      console.error(err)
    }
  if (email != owner) {
    buyItem(req, res)
  } else { 
    res.render('buyItem', { message: 'You are the owner of this item, idiot'})
  }
}

async function checkSaldo(req, res) {
  let ID = req.body.ID
  let price = ''
  let saldo = ''
  let email = req.session?.userEmail
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Id', sql.Int, ID)
      .query('SELECT Cena FROM Przedmioty WHERE Id_Przedmiotu = @Id')
      price = result.recordset[0].Cena
    } catch(err) {
      console.error(err)
    } 
  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Email', sql.VarChar(50), email)
      .query('SELECT Saldo FROM Uzytkownicy WHERE Email = @Email')
      saldo = result.recordset[0].Saldo
    } catch(err) {
      console.error(err)
    }
  if (price <= saldo) {
    checkIfNotOwner(req, res)
  } else {
    res.render('buyItem', { message: 'You do not have enough money to buy this item!'})
  }
}



async function showBuyItem(req, res) {
  res.render('buyItem', { login: req.session?.userLogin })
}
async function showSellItem(req, res) {
  res.render('sellItem', { login: req.session?.userLogin})
}

async function showAddItem(req, res) {
  if (req.session?.userLogin === 'Admin'){
    res.render('addItem')
  } else {
    res.send(" You're not an admin >:(( ")
  }
}

async function showDeleteItem(req, res) {
  if (req.session?.userLogin === 'Admin'){
    res.render('deleteItem')
  } else {
    res.send(" You're not an admin >:(( ")
  }
}

async function showAdminPanel(req, res) {
  if (req.session?.userLogin === 'Admin'){
    res.render('adminPanel')
  } else {
    res.send(" You're not an admin >:(( ")
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
app.get('/home', showItems);
app.get('/userProfile', showUserProfile)
app.get('/inventory', showInventory)
app.get('/adminPanel', showAdminPanel)
app.get('/addItem', showAddItem);
app.get('/deleteItem', showDeleteItem)
app.get('/sellItem', showSellItem)
app.get('/buyItem', showBuyItem)

//app posts
app.post('/login', login);
app.post('/addItem', addItem);
app.post('/register', register)
app.post('/deleteItem', deleteItem)
app.post('/sellItem', checkOwner)
app.post('/home', showItems)
app.post('/buyItem', checkSaldo);



//app listen
app.listen(port, (error) =>{
  if(error) throw error
  console.log("App running on port", port)
})

  
