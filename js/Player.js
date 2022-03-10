class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0
    this.positionY = 0
  }

  getCount() {
    var playerQuantieR = database.ref("playerCount");

    playerQuantieR.on("value", data => {
      playerCount = data.val();
    })
  }

  //Ele bota o código do jogo no banco de dados.
  updateCount(count) {
    //“/” é usado em updateCount para se referir ao diretório raiz.
    database.ref("/").update({playerCount: count})
  }

  addPlayer() {
    //Cria a hierárquia dos jogadores no banco de dados.
    var playerID = "players / player" + this.index

    //Posição dos jogadores (depende do ID).
    if (this.index == 1) {
      this.positionX = width / 2 - 100;
    }
    else {
      this.positionX = width / 2 + 100;
    }
    //Atualizando Banco de dados.
    database.ref(playerID).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY
    })
  }

  static getPlayersInfo() {
    var playersInfoR = database.ref("players");

    playersInfoR.on("value", data => {
      allPlayers = data.val();
    })
  }

  getDistance() {
    var distanceR = database.ref("players/player" + this.index)

    distanceR.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    })
  }
  // Está função atualiza as posições dos carros.
  update() {
    var playerID = "players/player" + this.index;
    database.ref(playerID).update({
      positionX: this.positionX,
      positionY: this.positionY,
    })
  }
}
