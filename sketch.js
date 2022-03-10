var canvas;
var carP1, carP2;
var backgroundImage, trackImage, carPlayerOneImage, carPlayerTwoImage;
var bgImg;
var database;
var form, player, allPlayers;
var playerCount;
var game, gameState;
var cars = []

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  trackImage = loadImage("./assets/PISTA.png");
  carPlayerOneImage = loadImage("./assets/car1.png");
  carPlayerTwoImage = loadImage("./assets/car2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.start();
  game.getState();
}

function draw() {
  background(backgroundImage);

  if (playerCount == 2) {
    game.updateState(1);
  }
  if (gameState == 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
