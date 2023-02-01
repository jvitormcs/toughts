const express = require("express");
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const conn = require('./db/conn')
const User = require('./models/User')
const Tought = require('./models/Tought')

const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes')

const ToughtController = require("./controllers/ToughtController");
const AuthController = require("./controllers/AuthController");

const app = express()
const PORT = process.env.PORT || 8083

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    name: "session",
    secret: "1MacacoMuitoLoucoNaLadeira!",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: () => {},
        path: require('path').join(require('os').tmpdir(), 'sessions'), 
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}),
)

app.use(flash())

app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.get('/', ToughtController.showToughts)

conn.sync().then(() => {app.listen(PORT)}).catch((err) => console.log(err))