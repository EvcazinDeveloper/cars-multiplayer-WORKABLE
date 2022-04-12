class Game {
  constructor() {
    this.reset = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboradT = createElement("h2");

    this.leaderboardP1 = createElement("h2");
    this.leaderboardP2 = createElement("h2");
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
    this.addSprites(oil, 8, oil_image, 0.01);
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
    this.resetButton.position(width / 2 + 230, 100);

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

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

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

          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
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
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }

  addSprites(groupName, spritesCount, spriteImages, spriteScale) {
    for (let sprite = 0; sprite < spritesCount; sprite++) {
      var x = random(width / 2 + 150, width / 2 - 150);
      var y = random(- height * 4.5, height - 400);
      var Sprite = createSprite(x, y);
      Sprite.addImage(spriteImages);
      Sprite.scale = spriteScale;
      groupName.add(Sprite);
   }
  }
}
