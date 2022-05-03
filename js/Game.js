class Game {
  constructor() {
    this.reset = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboradT = createElement("h2");

    this.leaderboardP1 = createElement("h2");
    this.leaderboardP2 = createElement("h2");
    this.carMovement = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    oil = new Group();
    coin = new Group();
    obstacle = new Group();
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2_img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1_img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1_img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2_img },
      { x: width / 2, y: height - 2800, image: obstacle2_img },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1_img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2_img }, 
      { x: width / 2 + 250, y: height - 3800, image: obstacle2_img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1_img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2_img },
      { x: width / 2, y: height - 5300, image: obstacle1_img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2_img }
    ];
    this.addSprites(obstacle, obstaclesPositions.length, obstacle1_img, 0.01, obstaclesPositions);
    this.addSprites(obstacle, obstaclesPositions.length, obstacle2_img, 0.01, obstaclesPositions);
    this.addSprites(oil, 9, oil_image, 0.01);
    this.addSprites(coin, 9, coin_image, 0.07);
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.reset.html("Reinicar Jogo");
    this.reset.class("resetText");
    this.reset.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 70);

    this.leaderboradT.html("Placar");
    this.leaderboradT.class("resetText");
    this.leaderboradT.position(width / 3 - 60, 40);

    this.leaderboardP1.class("leadersText");
    this.leaderboardP1.position(width / 3 - 50, 80);

    this.leaderboardP2.class("leadersText");
    this.leaderboardP2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getFinish();
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showOil();
      this.showLife();

      this.showLeaderboard();

     //índice da matriz
      var index = 0;
      for (var PLAYERS in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[PLAYERS].positionX;
        var y = height - allPlayers[PLAYERS].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.oilCollection(index);
          this.coinCollection(index);
          this.obstacleCollision(index);
          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      const FinishLine = height * 6 - 100;
      if (player.positionY > FinishLine) {
        gameState = 2;
        player.ranking = player.ranking + 1;
        Player.finishUpdate(player.ranking);
        this.showRank();
      }
      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        destination: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leaderboardP1, leaderboardP2;
    var players = Object.values(allPlayers);
    if (
      (players[0].ranking === 0 && players[1].ranking === 0) ||
      players[0].ranking === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leaderboardP1 =
        players[0].ranking +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leaderboardP2 =
        players[1].ranking +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].ranking == 1) {
      leaderboardP1 =
        players[1].ranking +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leaderboardP2 =
        players[0].ranking +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leaderboardP1.html(leaderboardP1);
    this.leaderboardP2.html(leaderboardP2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
      this.carMovement = true;
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
      this.carMovement = true;
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
      this.carMovement = true;
    }
  }

  addSprites(groupName, spritesCount, spriteImages, spriteScale, positionParameter = []) {
    for (let sprite = 0; sprite < spritesCount; sprite++) {
      var x = random(width / 2 + 150, width / 2 - 150);
      var y = random(- height * 4.5, height - 400);
      var Sprite = createSprite(x, y);
      Sprite.addImage(spriteImages);
      Sprite.scale = spriteScale;
      groupName.add(Sprite);
   }
  }

  oilCollection(index) {
    cars[index - 1].overlap(oil, function(collector, collected){
      player.oilValue = 185;
      collected.remove();
    })
    if (player.oilValue > 0 && this.carMovement) {
      player.oilValue = player.oilValue - 1
    }
    if (player.oilValue <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }
  coinCollection(index) {
    cars[index - 1].overlap(coin, function(collector, collected){
      player.score += 1;
      player.update();
      collected.remove();
    })
  }
  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.ranking}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  showLife() {
    push();
    image(life_img, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("gray");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("red");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    pop();
  }

  showOil() {
    push();
    image(oil_image, width / 2 - 130, height - player.positionY - 100, 20, 20);
    fill("gray");
    rect(width / 2 - 100, height - player.positionY - 100, 185, 20);
    fill(255, 161, 20);
    rect(width / 2 - 100, height - player.positionY - 100, player.oilValue, 20);
    pop();
  }

  gameOver() {
    swal({
      title: `Fim de Combustível`,
      text: "Oops, seu combustível esgotou e você perdeu!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar!"
    });
  }

  obstacleCollision(index) {
    if (cars[index - 1].collide(obstacle)) {
      if (player.life > 0) {
        player.life = player.life - 185 / 4;
      }
    }
    player.update();
  }
}