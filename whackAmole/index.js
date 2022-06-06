const path = require('path');
const port = 3001;
const bodyParser = require('body-parser'); //what is this?
const cookieParser = require('cookie-parser');  //and this?
const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const fs = require('fs');
const { recoverable } = require('repl');
const crypto = require('crypto')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jquery = require('jquery')(dom.window)

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(cookieParser());


// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.get('/', async (req, res) => {
    //res.send('Hello World')
    res.send(await readFile('./public/login.html', 'utf8') );
});

app.post('/setup', async function(req, res) {

    console.log("in set up");


    if (req.body.consent != "consent"){
        return;
    } else{
    // console.log(req);
        console.log(req.body);

        let userId = crypto.randomBytes(20).toString('hex');
        console.log(userId);

        inputdevice = req.body.input_device;

        consent = req.body.consent;

        res.cookie('sessionId', userId);

        fs.writeFileSync('./logs/' + userId + '.log', 'ID!' + userId + "\n");
        fs.appendFileSync('./logs/' + userId + '.log', "Date!" + new Date().toUTCString() + "\n");
        fs.appendFileSync('./logs/' + userId + '.log', "device!" + inputdevice + "\n");
        fs.appendFileSync('./logs/' + userId + '.log', "consent!" + consent + "\n");



        console.log("finished set up");

        res.send(await readFile('./public/game.html', 'utf8') );
        // return res.redirect("/game.html");
    };
    
});

app.post('/logPlayData', async function(req, res) {

    row = "leveldata!" + req.body.difficultylevel + "!" + req.body.nextstimtimeList + "!" + req.body.stimsclickedthislevel + "!" + req.body.accuracyratio + "!" + req.body.TS_accuracyratio + "!" + req.body.mousecordsX + "!" + req.body.mousecordsY + "!" + req.body.timemousecords + "!" + req.body.timestimsarrive + "!" + req.body.stimsshownthislevel + "!" + req.body.mouseCordsYClicks + "!" + req.body.mouseCordsXClicks + "!" + req.body.mouseClickTimes + "\n";
    userId = req.cookies['sessionId'];

    fs.appendFileSync('./logs/' + userId + '.log', row);

    res.send();

});

app.post('/logForm', async function(req, res) {

    row = req.body.formData + "\n";
    userId = req.cookies['sessionId'];

    fs.appendFileSync('./logs/' + userId + '.log', row);

    res.send();

});


app.listen(port, () => {
    console.log('listening on port 3001');
});