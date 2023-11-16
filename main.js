const express = require('express')
const app = express()
const path = require('node:path')
const route = require('./routes/routes')
const session = require('express-session')

// configuracion ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const PORT = process.env.PORT ?? 3001

app.use(express.static(__dirname + '/styles'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'secretKey_josefergo'
}))

app.use(route)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
