const express = require('express');
const hbs = require('express-handlebars')
const app = express()
const port = 5500


//app.engine('handlebars', engine());
app.set('view engine', 'hbs');
//app.set("views", "./views");

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
//Aktywanowanie aplikacji