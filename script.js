

var canvas;
var context ;
var Val_Max;
var Val_Min;
var sections;
var xScale;
var yScale;
var y;
var sketchCanvas;
var sketchcontext;
var going = false;
var imageCanvas;
var imagecontext;
var imageSRC;
var set_width = 650;
var set_height = 400;
		// values of each item on the graph

var data =
[
	{name: "Mon", amount: 87, colour: "red"},
	{name: "Tue", amount: 23, colour: "blue"},
	{name: "Wed", amount: 60, colour: "yellow"},
	{name: "Thur", amount: 70, colour: "green"},
	{name: "Fri", amount: 20, colour: "orange"},
	{name: "Sat", amount: 90, colour: "black"},
	{name: "Sun", amount: 60, colour: "brown"}
];


function init() {
		// intialize values for each variables
	sections = data.length-1;
	Val_Max = 100;
	var stepSize = 20;
	var columnSize = 50;
	var rowSize = 60;
	var margin = 10;

	canvas = document.getElementById("chart");
	context = canvas.getContext("2d");
	context.fillStyle = "#000;"

	canvas.setAttribute("width", set_width);
	canvas.setAttribute("height", set_height);

	yScale = (canvas.height - columnSize - margin) / (Val_Max);
	xScale = (canvas.width - rowSize) / (sections + 1);

	context.beginPath();
		// column names
	context.font = "19 pt Arial;"

//	context.font = "16 pt Helvetica"
	var count =  0;
	for (scale=Val_Max;scale>=0;scale = scale - stepSize) {
		y = columnSize + (yScale * count * stepSize);
		context.fillText(scale, margin,y + margin);
		context.moveTo(rowSize,y)
		context.lineTo(canvas.width,y)
		count++;
	}
	context.stroke();

		// print names of each data entry
	context.font = "20 pt Verdana";
	context.textBaseline="bottom";
	for (i=0;i<data.length;i++) {
		//
		computeHeight(data[i].amount);
		context.fillText(data[i].name, xScale * (i+1),y - margin);
	}

		// shadow for graph's bar lines with color and offset

	context.fillStyle="#9933FF;";
  context.shadowColor = 'rgba(128,128,128, 0.5)';

  //shadow offset along X and Y direction
	context.shadowOffsetX = 9;
	context.shadowOffsetY = 3;

		// translate to bottom of graph  inorder to match the data
  context.translate(0,canvas.height - margin);
	context.scale(xScale,-1 * yScale);

		// draw each graph bars
	for (i=0;i<data.length;i++) {
		context.fillStyle= data[i].colour;
		context.fillRect(i+1, 0, 0.3, data[i].amount);

	}
}

function computeHeight(value) {
	y = canvas.height - value * yScale ;
}











/* ---------- HELPER FUNCTIONS ----------------  */

// from quirksmode.org
// returns  offset from the top left corner of the
// element reference passed to it to the
// top left corner of the document
// [see notes]

function findPos(obj) {

	var curleft = curtop = 0;

	if (obj.offsetParent) {


	do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;


		} while (obj = obj.offsetParent);

	return [curleft,curtop];
	}

}



// function is passed a mouse event and returns the
// x, y coordinates of the mouse

function getMousePos(originalEvent)
{

	var posx = 0;
	var posy = 0;
	if (originalEvent.pageX || originalEvent.pageY) 	{
		posx = originalEvent.pageX;
		posy = originalEvent.pageY;
	}
	else if (originalEvent.clientX || originalEvent.clientY) 	{
		posx = originalEvent.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = originalEvent.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}


	return [posx, posy];

}


/* ---------- EVENT HANDLERs ----------------  */


// Called when the mouse moves over the canvas


// This is called whether the mouse is pressed or not.
// If mouse is pressed code elsewhere will set _going_ variable
// to true, false otherwise

function draw (e) {

if (going)
{
	if (!e) var e = window.event;


	var coords = getMousePos(e);

	posx = coords[0];
	posy = coords[1];


	var totaloffset = findPos(sketchCanvas);

 	totalXoffset = totaloffset[0];
 	totalYoffset = totaloffset[1];


	// Draw a line to where the mouse is now.

	sketchcontext.lineTo(posx-totalXoffset, posy-totalYoffset);

	sketchcontext.stroke();


}

}


// Called when the mouse button is first pressed
// over the canvas

function startdraw(e)
{

	if (!e) var e = window.event;

	var coords = getMousePos(e);

	posx = coords[0];
	posy = coords[1];

	var totaloffset = findPos(sketchCanvas);

 	totalXoffset = totaloffset[0];
 	totalYoffset = totaloffset[1];

 	console.log("findPos: " + totalXoffset + " " + totalYoffset);



	going = true;

	sketchcontext.beginPath();

	// Move the mouse to where the line your will draw should start

	sketchcontext.moveTo(posx-totalXoffset, posy-totalYoffset);

}



 // Called when the user leaves the canvas or
 // lets the mouse button up

function stopdraw()
{
	sketchcontext.closePath();

	going = false;

}



 // Change the thickness of the line

function setThickness(x)
{
	sketchcontext.lineWidth = x;
}


// Change the colour of the line

function setColour(name)
{
	sketchcontext.strokeStyle = name;
}



// Clear the sketch

function reset()
{
	sketchcontext.clearRect(0,0,sketchCanvas.scrollWidth, sketchCanvas.scrollHeight);
}


// Set up the sketch canvas (e.g. set dimensions, add event listeners, etc. )

function sketch_init()
{
	sketchCanvas = document.getElementById("sketcher");
	sketchcontext =  sketchCanvas.getContext("2d");

	sketchCanvas.setAttribute("width", set_width);
	sketchCanvas.setAttribute("height", set_height);


	// Assign event handlers for the Sketch canvas

	sketchCanvas.onmousemove = draw;
	sketchCanvas.onmousedown = startdraw;
	sketchCanvas.onmouseup = stopdraw;
	sketchCanvas.onmouseout = stopdraw;


	document.getElementById("thickness").onchange = function()
													{ setThickness(this.value);};

	document.getElementById("pencolour").onchange = function ()
													{ setColour(this.value);};

	document.getElementById("clear").onclick = reset;

	// setup the Sketch part

	reset();



}



// call sketch_init() when the page is ready

window.addEventListener("load", sketch_init);


function screenshot(){
imageCanvas = document.getElementById("canvas3");
imagecontext = imageCanvas.getContext("2d");

imagecontext.drawImage(canvas, 0, 0);
imagecontext.drawImage(sketchCanvas, 0, 0);

var image = new Image();
image.id = "imgi"
image.src = imageCanvas.toDataURL();
image.width = 250;
image.height = 230;
document.getElementById('imageCar').appendChild(image);

imagecontext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

}


/*

	Note you will need the following HTML components


	<canvas id = "sketcher" > </canvas>

	<select id = "thickness" >
		<option value = 1 selected>Thin</option>
		<option value = 3>Medium</option>
		<option value = 5>Thick</option>
	</select>

	<select id = "pencolour" >
		<option selected>Black</option>
		<option>Green</option>
		<option>Brown</option>
		<option>Red</option>
		<option>White</option>
		<option>Yellow</option>
	</select>


	<input type = "button" value = "Clear" id = "clear" >

*/
