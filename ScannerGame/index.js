var util= require('util');
var encoder = new util.TextEncoder('utf-8');
const path = require('path');
const port = 3000;
const bodyParser = require('body-parser'); //what is this?
const cookieParser = require('cookie-parser');  //and this?
const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const fs = require('fs');
const { recoverable } = require('repl');
const crypto = require('crypto');
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM("");
const jquery = require('jquery')(dom.window);


//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(cookieParser());


// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.get('/', async (req, res) => {
    res.send(await readFile('./public/login.html', 'utf8') );
});

app.post('/setup', async function(req, res) {

    console.log("in set up");

    if (req.body.consent != "consent"){
        return;
    } else{
    // console.log(req);
    // console.log(req.body);

    theirIP = req.ip;

    let userId = crypto.randomBytes(20).toString('hex');

    inputdevice = req.body.input_device;

    consent = req.body.consent;

    res.cookie('sessionId', userId);

    console.log(userId);
    console.log(theirIP);

    fs.writeFileSync('./logs/' + userId + '.log', 'ID!' + userId + "\n");
    fs.appendFileSync('./logs/' + userId + '.log', "IP!" + theirIP + "\n");
    fs.appendFileSync('./logs/' + userId + '.log', "Date!" + new Date().toUTCString() + "\n");
    fs.appendFileSync('./logs/' + userId + '.log', "device!" + inputdevice + "\n");
    fs.appendFileSync('./logs/' + userId + '.log', "consent!" + consent + "\n");




    console.log("finished set up");

    res.send(await readFile('./public/game.html', 'utf8') );
    // return res.redirect("/game.html");
    };
    
});

app.post('/logPlayData', async function(req, res) {

    console.log("logging play data");
    row = "leveldata!" + req.body.score + "!" + req.body.scores + "!" + req.body.timeb4broken + "!" + req.body.PmousecordsX + "!" + req.body.PmousecordsY + "!" + req.body.AmousecordsX + "!" + req.body.AmousecordsY + "!" + req.body.timemousecords + "!" + req.body.cursorstatuses + "!" + req.body.actualCreatureX + "!" + req.body.actualCreatureY + "!" + req.body.actualCreatureTimes + "\n";
    userId = req.cookies['sessionId'];

    fs.appendFileSync('./logs/' + userId + '.log', row);
    console.log("finished loffing play data");
    res.send();

});

app.post('/logForm', async function(req, res) {

    console.log("logging a form");

    row = req.body.formData + "\n";
    userId = req.cookies['sessionId'];

    fs.appendFileSync('./logs/' + userId + '.log', row);

    console.log("finished logging a form");
    res.send();

});


app.listen(port, () => {
    console.log('listening on port 3000');
});