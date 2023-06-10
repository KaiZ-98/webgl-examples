// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute float a_PointSize;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "  gl_PointSize = a_PointSize;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage location of a_PointSize");
    return;
  }

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position, a_PointSize,u_FragColor);
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  animation(gl, a_Position, a_PointSize, u_FragColor)
}

var g_points = []; // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
function click(ev, gl, canvas, a_Position, a_PointSize, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  // Store the coordinates to g_points array
  draw(x, y ,gl, a_Position, a_PointSize, u_FragColor)
}

function draw(x, y ,gl, a_Position, a_PointSize, u_FragColor){
    g_points.unshift([x,y]);
   // Store the coordinates to g_points array
   if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.unshift([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.unshift([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.unshift([1.0, 1.0, 1.0, 1.0]);  // White
  }
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_points.length;
  for (var i = 0; i < len; i += 1) {
    var rgba = g_colors[i];
    var point = g_points[i]
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0);
    gl.vertexAttrib1f(a_PointSize, Math.random()*10 + 5);
    gl.uniform4f(u_FragColor,Math.random(),Math.random(), Math.random(), rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

function animation(gl, a_Position, a_PointSize, u_FragColor){
  const func = ()=>{
    var flag1 = Math.random()>0.5?-1:1
    var flag2 = Math.random()>0.5?-1:1
    draw(Math.random() *flag1,Math.random()*flag2,gl, a_Position, a_PointSize, u_FragColor)
    while(g_colors.length>100){
      g_colors.pop()
    }
    while(g_points.length>100){
     g_points.pop()
    }
    requestAnimationFrame(func)
  } 
  requestAnimationFrame(func)
}
