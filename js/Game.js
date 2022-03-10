class Game {
  constructor() {}

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
    form.titleImg.class("gameTitleAfterEffect")
  }

  play() {
    this.handleElements();
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
        image(trackImage, 0, - height * 5, width, height * 6);
        var index = 0
        for(var PLAYERS in allPlayers) {
          index = index + 1;
          var x = allPlayers[PLAYERS].positionX;
          var y = height - allPlayers[PLAYERS].positionY;

          cars[index - 1].position.x = x
          cars[index - 1].position.y = y
        }
        this.movimentHandler();
        drawSprites();
    }
  }
  movimentHandler() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY = player.positionY + 1
      player.update();
    }
  }
}
