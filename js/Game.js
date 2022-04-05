class Game {
  constructor() {
    this.reset = createElement("h2");
    this.resetButton = createButton("");
    this.leaderboardT = createElement("h2"); 
    this.leaderboardP1 = createElement("h2");
    this.leaderboardP2 = createElement("h2"); 
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();

    playerCount = player.getCount();
    carP1 = createSprite(width / 2 - 50, height - 100);
    carP2 = createSprite(width / 2 + 100, height - 100);
    carP1.scale = 0.1
    carP2.scale = 0.1

    carP1.addImage(carPlayerOneImage);
    carP2.addImage(carPlayerTwoImage);

    cars = [carP1, carP2]
  }
  getState() {
    var gameStateR = database.ref("gameState")
  
    gameStateR.on("value", function(data) {
      gameState = data.val()
    })
  }

  //Ele bota o código do jogo no banco de dados.
  updateState(state) {
    //“/” é usado em updateCount para se referir ao diretório raiz.
    database.ref("/").update({gameState: state})
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.reset.html("Reniciar o Jogo");
    this.reset.class("resetText");
    this.reset.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderboardT.html("placar");
    this.leaderboardT.class("resetText");
    this.leaderboardT.position(width / 3 - 60, 40);

    this.leaderboardP1.class("leadersText");
    this.leaderboardP1.position(width / 3 - 50, 80);
    
    this.leaderboardP2.class("leadersText");
    this.leaderboardP2.position(width / 3 - 50, 130);
  }

  resetHandler() {
    this.resetButton.mousePressed(
      () => {
        database.ref("/").set({
          gameState: 0,
          playerCount: 0,
          players: {}
        })

        // recarregar janela
        window.location.reload();
      })
  }

  play() {
    this.handleElements();
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
        image(trackImage, 0, - height * 5, width, height * 6);
        this.showLeaders();
        var index = 0
        for(var PLAYERS in allPlayers) {
          index = index + 1;
          var x = allPlayers[PLAYERS].positionX;
          var y = height - allPlayers[PLAYERS].positionY;

          cars[index - 1].position.x = x;
          cars[index - 1].position.y = y;

          // indetificando jogador
          if (index == player.index) {
            stroke(10);
            fill("green");

            ellipse(x, y, 70, 70)

            //Alterar a posição da camera na posição Y
            camera.position.x = cars[index - 1].position.x;
            camera.position.y = cars[index - 1].position.y;
          }
        }
        this.movimentHandler();
        this.resetHandler();
        drawSprites();
    }
  }
  movimentHandler() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY = player.positionY + 1;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX = player.positionX - 1;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX = player.positionX + 1;
      player.update();
    }
  }
}
