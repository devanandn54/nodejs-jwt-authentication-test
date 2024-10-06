const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var { expressjwt: jwtMiddleware } = require("express-jwt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

const PORT = 3000;
const SECRET_KEY = "NBAD";
const jwtAuth = jwtMiddleware({
    secret: SECRET_KEY,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        email: "example1@email.com",
        password: 1234567
    },
    {
        id: 2,
        email: "example2@email.com",
        password: 123456789
    }
]


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const userFound = users.find(user => user.email === email && user.password == password);

    if(userFound){
        const token = jwt.sign({ id: userFound.id, email: userFound.email}, SECRET_KEY, { expiresIn: '3m' });
        res.json({ message: 'Login Successful', token});
    }else {
        res.status(401).json({ message: 'Invalid credentials'});
        console.log("executing this");
    }
    


});
app.get('/dashboard', jwtAuth, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: "Seen by logged in users only"
    })
});

app.get('/settings', jwtAuth, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: "Here you can modify the things you would like to"
    })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});