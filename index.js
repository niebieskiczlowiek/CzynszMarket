const express = require('express')
const port = 5500

const app = express()
app.set('view engine', 'hbs')


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



app.listen(port)

//Wyjaśnienie dla miłoszka co tu sie stało xD:
//
//Ten plik to główny plik aplikacji so far 
//Tu masz port, express.js hbs'a i podstrony
//
//pliki jsonnowe i node_modules to jakies pierdoły dodane przez npma (możemy miec je gdzies)
//
//zamiast html robimy hbs by móc to wyświetlać na podstronach 