let Qform = document.getElementById('Qform');
let demogForm = document.getElementById('demogQs');
let gameover_text = document.getElementById('gameover');
let instructions = document.getElementById('instructions');
let readyUptxt = document.getElementById('readyUp');


let canvases = document.getElementById("canvases");
let canvas = document.getElementById('canvas');
// let littlecanvas = document.getElementById('littlecanvas');

let rect = canvas.getBoundingClientRect();

let context = canvas.getContext('2d');
context.font = "30px Arial";
context.fillStyle = fillcolor;
context.lineWidth = linewidth;
context.strokeStyle = strokestyle;
context.fillStyle = fontcolor;
context.textAlign = textalign;
context.font = fonttype;

// let littlecontext = littlecanvas.getContext('2d');
// littlecontext.font = "30px Arial";
// littlecontext.fillStyle = fillcolor;
// littlecontext.lineWidth = linewidth;
// littlecontext.strokeStyle = strokestyle;
// littlecontext.fillStyle = "black";
// littlecontext.textAlign = textalign;
// littlecontext.font = fonttype;


var fillcolor = "green";
var linewidth = 20;
var strokestyle = "#003300";
var fontcolor = "white";
var textalign = "center";
var fonttype = "Arial";


// var playing;
let stage;
let gamecomplete;
// var h = 1;

//var fname = "mydata.txt"

//game exectution variables
let timeb4broken = 60.0 * 1000;
let timebroken = 60.0 * 1000;
let cursorstatus = "normal";
let score = 0;
let maxScore = 100000;
let actualCursorX = 100000;
let actualCursorY = 100000;
let cursorX = 200000;
let cursorY = 200000;
let levelStartTime;
let leveltimelimit = 180 * 1000; //60000

let scannersize = 15; //og 15

let showdemogform = true;

let creatureX = [];
let creatureY = [];
let creatureA = [];

let actualCreatureX = [];
let actualCreatureY = [];
let actualCreatureTimes = [];


//options are CreatureXLevy, CreatureXcordsP, CreatureXLogMap, CreatureXIkeMap, CreatureXRW, CreatureXJC, CreatureJC_WS, CreatureJC_PD
$.getJSON("stuff/CreatureXJC_PD30_2.json",
    (Xdata)=>{creatureX = Xdata;});
$.getJSON("stuff/CreatureYJC_PD30_2.json",
    (Ydata)=>{creatureY = Ydata;});
$.getJSON("stuff/CreatureTJC_PD30_2.json",
   (Angles)=>{creatureA = Angles;});

$.getJSON("stuff/PCreatureXLevy.json",
   (PXdata)=>{PcreatureX = PXdata;});
$.getJSON("stuff/PCreatureYLevy.json",
   (PYdata)=>{PcreatureY = PYdata;});
$.getJSON("stuff/PCreatureThetaLevy.json",
  (PAngles)=>{PcreatureA = PAngles;});



let creature = new Image();
creature.src = 'stuff/alien_bug.png';


let voffset = [];
let hoffset = [];

//oprionts cursorOffsetsY and MouseYBrown MouseYOC_PD10 MouseXJC_P, MouseXJCP
$.getJSON("stuff/MouseYWhite.json",
    (data)=>{voffset = data;});
$.getJSON("stuff/MouseXWhite.json",
    (data2)=>{hoffset = data2;});

function badmouse(time1, time2 = 60000){
    // console.log(time1);
    // console.log(time2);
    cursorstatus = "broken";
    let mousenoise = setInterval(()=>{
        voffset.shift();
        hoffset.shift();
        // console.log("length is:  " + creatureX.length);
        $('#scanner').offset({
            left: actualCursorX + hoffset[0] -17,
            top: actualCursorY + voffset[0] -18
        });
    }, time1);
    badmouseTimer = setTimeout(() => {clearInterval(mousenoise), cursorstatus="normal", hoffset=[0], voffset=[0]}, time2);
};


//game setting
//experiment variables

// var timetimerstarted;

let timemousecords = [];
let cursorstatuses = [];
let PmousecordsX = [];
let PmousecordsY = [];
let AmousecordsX = [];
let AmousecordsY = [];
let scores = [];
let GameCounter = 0;

let gameInterval;
let badmouseTimer;

//

var play = function() {
    console.log(stage);
    if (stage=="pregamePractice"){
        // canvases.style.cursor = "none";
        // littlecanvas.style.cursor = "none";
        $('.altMouse').show();

        instructions.style.display='none';
        readyUptxt.style.display='none';
        context.font = "30px Arial";

        // context.fillStyle = 'green';
        // context.fillStyle = 'rgba(225,225,225,0.5)';
        // context.fillRect(90, 90, 400, 350);
        context.strokeStyle = 'green';
        context.strokeRect(90, 90, 400, 350);
        context.strokeStyle = "black";
        context.strokeRect(300, 530, 100, 100);
        context.font = "20px Arial";
        context.fillText("Click the rectangle when you are done practicing.", 100, 470);
        context.fillText("you must have atleast 100 score.", 130, 500);
        context.font = "30px Arial";

        gameInterval = setInterval(()=>{
            if (cursorX >= PcreatureX[0] - scannersize && cursorX <= PcreatureX[0] + 50 + scannersize && cursorY >= PcreatureY[0] && cursorY <= PcreatureY[0] + 53 + scannersize) {
                    score += 1;
                    if (score == 100){
                        alert("you have completed the practice trial, but can continue practicing as long as you like");
                    }
                }

            //rotate
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = 'green';
            context.strokeRect(90, 90, 400, 350);
            context.strokeStyle = "black";
            context.strokeRect(300, 530, 100, 100);
            context.font = "20px Arial";
            context.fillText("Click the rectangle when you are done practicing.", 100, 470);
            context.fillText("you must have atleast 100 score.", 130, 500);
            context.font = "30px Arial";
            context.translate(PcreatureX[0] + 25, PcreatureY[0] + 26);
            context.rotate((PcreatureA[0]) + 2.356);  //+ 0.785398
            context.translate(-(PcreatureX[0] + 25), -(PcreatureY[0] + 26));
            context.drawImage(creature, PcreatureX[0], PcreatureY[0]);
            context.restore();
            context.fillText(score, 500, 45);


            PcreatureX.shift();
            PcreatureY.shift();
            PcreatureA.shift();
            //  if(score > 30){
            //     littlecontext.clearRect(0, 0, littlecanvas.width, littlecanvas.height);
            //     score = 0;
            // }
            }, 20);	



    } else {

        context.font = "30px Arial";
        canvases.style.cursor = "none";
        $('.altMouse').show();

        readyUptxt.style.display='none';

        levelStartTime = Date.now();

    // possibly set this to wait till loaded stuff?

        let grass = new Image();
    
        grass.onload=function(){
            document.body.background = grass;
        }
        grass.src = 'stuff/desert.jpg';
        $("body").css("background-image", "url(stuff/desert.jpg)");

        badmouseTimer = setTimeout(badmouse, timeb4broken, 20, timebroken);

        gameInterval = setInterval(()=>{
            if (cursorX >= creatureX[GameCounter] - scannersize && cursorX <= creatureX[GameCounter] + 50 + scannersize && cursorY >= creatureY[GameCounter] && cursorY <= creatureY[GameCounter] + 53 + scannersize) {
                    score += 1;
                } else {
                    score -= .1;
                    score = Math.round(score * 100) / 100;
                    score = Math.max(score, 0);
                };
            scores.push(score);

            //rotate
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.translate(creatureX[GameCounter] + 25, creatureY[GameCounter] + 26);
            context.rotate((creatureA[GameCounter]) + 2.356);  //+ 0.785398
            context.translate(-(creatureX[GameCounter] + 25), -(creatureY[GameCounter] + 26));
            context.drawImage(creature, creatureX[GameCounter], creatureY[GameCounter]);
            context.restore();
            context.font = "30px Arial";
            context.fillText("Your score: ", 500, 50);
            context.fillText(score, 700, 50);
            context.fillText(Math.floor(((levelStartTime + leveltimelimit) - Date.now()) / 60000) + ":" + ((((levelStartTime + leveltimelimit) - Date.now()) % 60000) / 1000).toFixed(0), 350, 50);
            context.font = "20px Arial";
            context.fillText("1st: A3D***********: 6996.6", 10, 50);
            context.fillText("2nd: A2A***********: 3798.5", 10, 80);
            context.fillText("3rd: AOT***********: 1750.9", 10, 110);
            context.font = "30px Arial";

            actualCreatureX.push(creatureX[GameCounter]);
            actualCreatureY.push(creatureY[GameCounter]);
            actualCreatureTimes.push(Date.now());

            GameCounter += 1;
            // creatureX.shift();
            // creatureY.shift();
            // creatureA.shift();
             if(Date.now() > levelStartTime + leveltimelimit){
                context.clearRect(0, 0, canvas.width, canvas.height);
                finishedlevel()
            }
            }, 20);	

    }

};

function finishedlevel() {
    // console.log("in finished level");
    clearTimeout(badmouseTimer);
    clearInterval(gameInterval);
    canvases.style.cursor = "";

    logScores( score, scores, timeb4broken, PmousecordsX, PmousecordsY, AmousecordsX, AmousecordsY, timemousecords, cursorstatuses, actualCreatureX, actualCreatureY, actualCreatureTimes);
    PmousecordsX = [];
    PmousecordsY = [];
    AmousecordsX = [];
    AmousecordsY = [];
    // mouseCordsYClicks = [];
    // mouseCordsXClicks = [];
    timemousecords = [];
    // mouseClickTimes = [];

    //add condition if add future levels
    gamecomplete = true;

    alert("your final score was: " + score);

    checkfun();    
};


function logScores( score, scores, timeb4broken, PmousecordsX, PmousecordsY, AmousecordsX, AmousecordsY, timemousecords, cursorstatuses, actualCreatureX, actualCreatureY, actualCreatureTimes) {
    // console.log(actualCreatureX.length);
    $.ajax({
        url: '/logPlayData',
        type: 'POST',
        data: {
            score: score,
            scores: scores,
            timeb4broken: timeb4broken,
            PmousecordsX: PmousecordsX,
            PmousecordsY: PmousecordsY,
            AmousecordsX: AmousecordsX,
            AmousecordsY: AmousecordsY,
            timemousecords: timemousecords,
            cursorstatuses: cursorstatuses,
            actualCreatureX: actualCreatureX,
            actualCreatureY: actualCreatureY,
            actualCreatureTimes: actualCreatureTimes
        }
    });
};

var checkfun = function() {

	$("body").css("background-image", "none");
    
    Qform.reset();
    Qform.style.display=""; // initial
    stage = "checkingfun";
};

function backtoGame(form){
    saveform(form);
    if(gamecomplete == false){
        stage = "playing";
        play(difficultylevel);
        return false;
    } else {
        thatsgame();
        return false;
    };
};

function whatever(form){
    return backtoGame.bind(form);
};

function saveform(form) {
    // console.log("in save form");
    var checkfunData;
    //console.log(form.id);
    checkfunData += form.id + "!";
    for (i = 0; i < form.length; i++){
    	if(form.elements[i].type != "radio" && form.elements[i].type != null){
    		checkfunData += form.elements[i].name + "=" + form.elements[i].value + ", ";
    	}
        if(form.elements[i].checked == true){
            checkfunData += form.elements[i].name + "=" + form.elements[i].value + ", ";
        }
    }
    json_checkfunData = JSON.stringify(checkfunData);
    $.ajax({
        url: '/logForm',
        data: {formData: json_checkfunData},
        type: 'POST'
    });
    return false;
}


var thatsgame = function() {
    Qform.style.display='none';
    demogForm.style.display="none";
    if(showdemogform == true){
        showdemogform = false;
        demogForm.reset();
        demogForm.style.display=""; //initial
    } else {
        $("body").removeAttr('style');
        gameover_text.style.display=""; //initial
        key = document.cookie.split('=')[1];//makeid();
        key = "ID!" + key
        jsonkey = JSON.stringify(key);
        $.ajax({
        url: '/logForm',
        data: {formData: jsonkey},
        type: 'POST'
        });
        document.getElementById('key').innerHTML = key;
    }
};

canvas.addEventListener('click', function(e) {
    // var clickedX = e.pageX - this.offsetLeft;
    // var clickedY = e.pageY - this.offsetTop;


    let clickedX = cursorX;
    let clickedY = cursorY;

    console.log("clicked");
    console.log(stage);
    console.log(clickedX);
    console.log(clickedY);

    // console.log("clicked");
    // console.log(stage);

    if (stage == "intro") {
        // console.log("clicked to start game");
        // console.log(clickedX);
        // console.log(clickedY);
        if (clickedX < 400 && clickedX >= 300 && clickedY >= 500 && clickedY <= 600) {
            // console.log("started");
            context.clearRect(0, 0, canvas.width, canvas.height);
            consent = true;
            stage = "pregamePractice";
            play();
        };
    } else if (stage == "pregamePractice"){
        console.log(clickedX, clickedY);
        //new rectangele
        //available after certain score
        if (clickedX < 400 && clickedX >= 300 && clickedY >= 530 && clickedY <= 630){
            if(score >= 100){
                clearInterval(gameInterval);
                canvas.style.cursor = "";
                // littlecontext.clearRect(0, 0, littlecanvas.width, littlecanvas.height);
                context.clearRect(0, 0, canvas.width, canvas.height);
                score = 0;
                // alert("You are done with practice. Click ok to begin the real game.")
                context.strokeStyle = "black";
                context.strokeRect(300, 250, 100, 100);
                // context.font = "50px Arial";
                // context.fillText("You are done with practice. Click inside the rectangle to begin the real game.", 100, 100)
                readyUptxt.style.display="";
                $('.altMouse').hide();
                stage = "readyUp";
                // play();
                console.log(stage);
            } else {
                alert("you need at least 100 score to go on with the experiment");
            }
        };
    } else if (stage == "readyUp"){
        if (clickedX < 400 && clickedX >= 300 && clickedY >= 250 && clickedY <= 350){
            context.clearRect(0, 0, canvas.width, canvas.height);
            stage = "playing";
            play();
        };
    };
    
});


$(document).mousemove(function (e) {

    if (stage == "playing" || stage == "pregamePractice"){
        $('.altMouse').offset({
            left: e.pageX + hoffset[0] -17,
            top: e.pageY + voffset[0] -18
            // left: (e.pageX - 17),
            // top: (e.pageY- 18)
        });
        actualCursorX = e.pageX;
        actualCursorY = e.pageY;
        cursorX = (e.pageX + hoffset[0]) - rect.left;
        cursorY = (e.pageY + voffset[0]) - rect.top;
        if(stage == "playing"){
            PmousecordsX.push(cursorX);
            PmousecordsY.push(cursorY);
            AmousecordsX.push(actualCursorX);
            AmousecordsY.push(actualCursorY);
            timemousecords.push(Date.now());
            cursorstatuses.push(cursorstatus);
        };
    } else {
        $('.altMouse').hide();
        cursorX = (e.pageX + hoffset[0]) - rect.left;
        cursorY = (e.pageY + voffset[0]) - rect.top;
    }

});



// $(document).mousemove(function(e) {
//     // console.log("mousemoving")
//     $('.altMouse').offset({
//         left: e.pageX + cursoroffsetX[0],
//         top: e.pageY +  cursoroffsetY[0]
//     });
// });


var checktime = function() {
    var d = new Date();
    return d.getTime();
}

function updateSlider(value, slider) {
    document.getElementById(slider).innerHTML=value;
}





/*

NEW FUNCTIONS MADE FOR WHACKAMOLE

*/



function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



//set up game at start, probbaly find a cleaner way to do this later

stage = "intro";
gamecomplete = false;
Qform.style.display='none';
demogForm.style.display='none';
gameover_text.style.display='none';
readyUptxt.style.display='none';
// if(version=="boring"){
//     whackamole_inst.style.display='none';
// } else if (version == "whackamole") {
//     boring_instructions_text.style.display='none';
// };
context.font = "30px Arial";
//context3.strokeText("click the rectangle to begin", 400, 400);
context.strokeRect(300, 500, 100, 100);
