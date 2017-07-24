var lastlight = "0,0,0";
var lastinfo = 0;
var CSGOGSI = require('node-csgo-gsi');
var gsi = new CSGOGSI();

var bombInterval = 1000;
var roundPhase = "";
var lastWinner = "";
var lastWinnerColor = "";

var color = [];
color.white = "252,124,84";

var red = 0; var green = 0; var blue = 0;

var SerialPort = require('serialport');
var serialPort = new SerialPort('COM3');

// Opens serial port to communicate with Arduino UNO.
serialPort.on('open', function() {
  serialPort.write(color.white+'\n', function(err) {
	if (err) {
	  return console.log('Failed to open port: ', err.message);
	}
	console.log('Port is now open!');
  });
});

// Bomb Planted
gsi.on('bombTimeStart', function() {
  //console.log('C4 planted');
	isBombPlanted = true;
	bombInterval = 1000;
	startBombTick();
});

// Bomb Click
gsi.on('bombTimeLeft', function(time) {
    //console.log('C4:' + Math.round(time));

	if(roundPhase == "live" && Math.round(time) <= 0)
	{
		roundPhase = "over";
	}
});

// Last Winning Team
gsi.on('roundWinTeam', function(data) {
	lastWinner = data;

	if(lastWinner == "T")
	{
		lastWinnerColor = "255,128,0";
	}
	else if(lastWinner == "CT")
	{
		lastWinnerColor = "0,0,255";
	}

	//console.log(data);
});

// Round Phase
gsi.on('roundPhase', function(data) {

	// Changed!
	if(roundPhase != data)
	{
		roundPhase = data;

		if (data == 'over')
		{
			isBombPlanted = false;
			changelight(color.white);

			setTimeout(function(){
				if(lastWinner == "CT")
				{
					startWinnerTick("255,128,0");
				}
				else if(lastWinner == "T")
				{
					startWinnerTick("0,0,255");
				}
			},10);

		}

		if(data == "live")
		{
      isBombPlanted = false;
			changelight(color.white);
		}

		if(data == "freezetime")
		{
      isBombPlanted = false;
			changelight(color.white);
		}
	}

	//console.log(data);

	roundPhase = data;
});

// Change Light Function
function changelight(color)
{
	serialPort.write(color+"\n", function(err, results)
	{
		//console.log('Sent serial: '+color);
	});

	lastlight = color;
}

// Winner
function startWinnerTick()
{
	if(roundPhase == "over")
	{
		if(lastlight == lastWinnerColor)
		{
			changelight("0,0,0");
		}
		else
		{
			changelight(lastWinnerColor);
		}
	}

	if(roundPhase == "over")
	{
		setTimeout( startWinnerTick, 100 );
	}
}

// Bomb ticking script.
function startBombTick() {
   bombInterval = bombInterval - 8;
   if(isBombPlanted && roundPhase == "live")
	{
		if(lastlight == "255,0,0")
		{
			changelight("0,0,0");
		}
		else
		{
			changelight("255,0,0");
		}
	}

	if(bombInterval > 0 && roundPhase == "live")
	{
		setTimeout( startBombTick, bombInterval );
	}
}

setTimeout(function(){changelight(color.white)},2000);
