const
    //http = require('http'),
    //fs = require('fs'),
    //path = require('path');
    //handlebars = require('handlebars'),
    expressHandlebars = require('express-handlebars'),
    express = require('express'),
    newsapi = require('newsapi-wrapper');
require('dotenv').config();

const port = 3000;
//Kein externer Webserver nötig. nodejs übernimmt diese funktion

const server = express();
server.set('viewDir','views');//wo liegen templates

//server.use() -> einbindung einer middleware-function die req res beliebig verändert

//wird diese vor der static-middleware eingebunden, so
//werden auch css-files angezeigt, da sonst diese middleware nicht zur ausführung kommt
//die static-middleware fuehrt direkt zum ende
const logMiddleware = (req, res, next) => {
    console.log('Request: '+req.url);
    next();
}
server.use(logMiddleware);


//middleware - einbindung des public-ordners
server.use(express.static('public'));//wo liegen statische dateien

server.engine('html', expressHandlebars({//template-engine initialisieren
    extname: 'html',
    partialsdir: 'view/partials'
}));

/*
server.use((req, res, next) => {
    console.log('Middleware speaking...');
    next();//um die verarbeitungskette der middlewares nicht zu unterbrechen
});
//ODER
const doNotingMiddleware = (req, res, next) => {
    console.log('Middleware speaking...');
    next();
};
//server.use(doNotingMiddleware);

*/
server.set('view engine', 'html');//setze standard-dateiendung fuer template-dateien

const authMiddleware = (req, res, next) => {
    res.writeHead(401);
    res.end('Permission denied');
};
server.use('/private/*',authMiddleware);


const renderHome = (req, res) => {
    let articles = [],
    message = '';
    newsapi.setApiKey(process.env.NEWS_API_KEY)
        .send()
        .then( response => {
            articles = response.articles;
        })
        .catch(err => {
            message = 'Error when retrieving Articles from NewsAPI';
        })
        .then(() => {
            res.render('home', {
                title: 'Welcome',
                heading: 'Hallo',
                homeActive: true,
                articles: articles,
                message: message
            });
        });    
};
//2 routen die auf die selbe funktion zeigen
server.get('/', renderHome);
server.get('/home', renderHome);

const renderAdmin = (req, res) => {
    res.render('settings', {
        title: 'Welcome',
        heading: 'Hallo in settings',
        settingsActive: true,
    });
}
//server.get('/admin', renderAdmin);
server.get('/settings', renderAdmin);

const renderLogin = (req, res) => {
    res.render('login', {
        title: 'Welcome',
        heading: 'Hallo in login',
        loginActive: true,
    });
}
server.get('/Login', renderLogin);


server.get('/test', (req,res) => {
    res.render('test', {
        title: 'Welcome',
        heading: 'Hallo',
        testActive: true,
    });
});

const submitLogin = (req, res) => {
    console.log(req.body);
    return renderLogin(req, res);
};

const articles = [
    {
        url: 'https://example.com',
        title: 'Am Sonntag Krötenwanderung auf dem Immerdeich'
    },
    {
        url: 'https://example.com',
        title: 'Bayern kauft Ronaldo'
    },
    {
        url: 'https://example.com',
        title: 'Wirtschaft schwächelt sich durch den Sommer'
    }
];

server.listen(port, () => {
    console.log('Server is listening at port '+port);
})







