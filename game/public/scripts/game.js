var SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight,
  HALF_WIDTH = SCREEN_WIDTH / 2,
  HALF_HEIGHT = SCREEN_HEIGHT / 2,
  WALLS_WIDTH = SCREEN_WIDTH/120,
  colorbackgrounddark = "#2F2F2F",
  colorbackground = "#EAE2CC",
  colororange = "#E6A301",
  colorbluelight = "#51B0E7",
  colorbluedark = "#375398",
  colorgreen = "#029C67",
  coloryellow = "#EAE22B",
  canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");

function init(){
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  draw();
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight,
  HALF_WIDTH = SCREEN_WIDTH / 2,
  HALF_HEIGHT = SCREEN_HEIGHT / 2,
  WALLS_WIDTH = SCREEN_WIDTH/120;
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  draw();
}

function draw(){
  //BACKGROUND
  context.beginPath();
  context.fillStyle = colorbackground;
  context.fillRect(0,0,SCREEN_WIDTH, SCREEN_HEIGHT);

  //BORDERS OF MAP
  //UPPer
  context.beginPath();
  context.rect(0, 0, SCREEN_WIDTH, 10);
  context.fillStyle= colororange;
  context.fill();
  //LEFT BORDER
  context.beginPath();
  context.rect(0,0, 10, SCREEN_HEIGHT);
  context.fillStyle= colororange;
  context.fill();
  //BOTTOM BORDER
  context.beginPath();
  context.rect(0,SCREEN_HEIGHT-10, SCREEN_WIDTH, 10);
  context.fillStyle= colororange;
  context.fill();
  //RIGHT BORDER
  context.beginPath();
  context.rect(SCREEN_WIDTH-10,0, 10, SCREEN_HEIGHT);
  context.fillStyle= colororange;
  context.fill();

  //WALLS ON MAP
  //UPPER LEFT
  context.beginPath();
  context.rect(SCREEN_WIDTH/7*2, 0, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //DOWN LEFT
  context.beginPath();
  context.rect(SCREEN_WIDTH/7, SCREEN_HEIGHT/3, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //DOWN RIGHT
  context.beginPath();
  context.rect(SCREEN_WIDTH/7*5-WALLS_WIDTH, SCREEN_HEIGHT/3*2, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //UPPER RIGHT
  context.beginPath();
  context.rect(SCREEN_WIDTH/7*6-WALLS_WIDTH, SCREEN_HEIGHT/3, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //DOWN MIDDLE
  context.beginPath();
  context.rect(SCREEN_WIDTH/7*3, SCREEN_HEIGHT/3*2, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //UPPER MIDDLE
  context.beginPath();
  context.rect(SCREEN_WIDTH/7*4-WALLS_WIDTH, 0, WALLS_WIDTH, SCREEN_HEIGHT/3);
  context.fillStyle = colororange;
  context.fill();
  //DOWN MIDDLE CIRCLE
  context.beginPath();
  context.arc(SCREEN_WIDTH/7*3, SCREEN_HEIGHT/3+(SCREEN_HEIGHT/3)/2, (SCREEN_HEIGHT/3)/2, 3/2*Math.PI, Math.PI /2,true);
  context.strokeStyle = colororange;
  context.stroke();
  //DOWN MIDDLE CIRCLE
  // context.beginPath();
  // context.rect(SCREEN_WIDTH/7*4, 0, WALLS_WIDTH, SCREEN_HEIGHT/3);
  // context.fillStyle = colororange;
  // context.fill();

  //DEBUGGING
  console.log(SCREEN_HEIGHT + ", "+SCREEN_WIDTH);
}



init();
