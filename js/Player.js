class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.score = 0;
    this.ranking = 0;
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
      positionY: this.positionY,
      ranking: this.ranking,
      score: this.score
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
      ranking: this.ranking,
      score: this.score,
    })
  }

  showLeaders() {
    var leader1;
    var leader2;
    var players = Object.values(allPlayers);

    if (players[0].ranking == 0 && players[1].ranking == 0 || players[0].ranking == 1) {
      leader1 = players[0].ranking + "&emsp;" + players[0].name + players[0].score;
      leader2 = players[1].ranking + "&emsp;" + players[1].name + players[1].score;
    }
    else if (players[1].ranking == 1) {
      leader1 = players[1].ranking + "&emsp;" + players[1].name + players[1].score;
      leader2 = players[0].ranking + "&emsp;" + players[0].name + players[0].score;
    }
    
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
}