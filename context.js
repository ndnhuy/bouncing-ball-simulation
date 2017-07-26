var visible_canvas = document.getElementById('myCanvas');
var visible_context = visible_canvas.getContext('2d');

var width = visible_canvas.getAttribute('width');
var height = visible_canvas.getAttribute('height');
// var width = visible_canvas.offsetWidth;
// var height = visible_canvas.offsetHeight;
var posXElement = document.getElementById('positionX');
var posYElement = document.getElementById('positionY');
var timeElement = document.getElementById('time');

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


function getRandomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}
function getRandomColor() {
    return "#"+((1<<24)*Math.random()|0).toString(16);
}