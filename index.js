const express = require('express')
//dodawanie expressa
const port = 5500
const app = express()
app.set('view engine', 'hbs')
//dodawanie szablonó hbs do renderowania stron


app.get('/', (req, res) => {
    res.render('index')
});
app.get('/register', (req, res) => {
    res.send('Register page here')
});
app.get('/login', (req, res) => {
    res.send('Login page here')
});
app.get('/home', (req, res) => {
    res.render('home')
});
// pod strony ^^



app.listen(port)
//Aktywanowanie aplikacji