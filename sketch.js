var canvas;
var car1, car2;
var backgroundImage, track, car1_img, car2_img, oil_image, coin_image, obstacle1_img, obstacle2_img, life_img;
var bgImg;
var database;
var form, player, allPlayers;
var playerCount;
var game, gameState;
var cars = [];
var oil;
var coin;
var obstacle;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  track = loadImage("./assets/PISTA.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  oil_image = loadImage("./assets/fuel.png");
  coin_image = loadImage("./assets/goldCoin.png");
  obstacle1_img = loadImage("./assets/obstacle1.png");
  obstacle2_img = loadImage("./assets/obstacle2.png");
  life_img = loadImage("./assets/life.png");
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
    game.update(1);
  }
  if (gameState == 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
