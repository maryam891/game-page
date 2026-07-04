let startGameContainer = document.querySelector("#Start-gameContainer");
let backgroundImg = document.querySelector("#background-img");
let gameRulesContainer = document.querySelector(".gameRulesContainer");
let gameRulesBtn = document.getElementById("gameRules-btn");
let startGameBtn = document.getElementById("startGame-btn");
let closeOverlayBtn = document.getElementById("closeBtn");
let attackBtn = document.getElementById("attackBtn");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let playAgainBtn = document.getElementById("playAgainBtn");
let pointCount = document.querySelector(".pointsCount");
let pointsContainer = document.querySelector(".pointsContainer");
let pointCountText = document.querySelector(".pointsCountText");
let getNewCardBtn = document.getElementById("getNewCardBtn");
let textState = document.createElement("h2");
startGameContainer.appendChild(textState);
textState.style.display = "none";
attackBtn.disabled = false;

// Button shows game rules overlay
gameRulesBtn.addEventListener("click", () => {
  gameRulesContainer.style.display = "block";
  backgroundImg.style.display = "block";
});

// Button for closing the game rules overlay
closeOverlayBtn.addEventListener("click", () => {
  gameRulesContainer.style.display = "none";
});
//Declare outside to be able to access variables
let playerCard1;
let playerCard2;
let randomCards;
let index1;
let index2;
let getStoredHighScore;
let points = 0;

function generateCard1() {
  index1 = Math.floor(Math.random() * randomCards.length);
  playerCard1 = randomCards[index1];
  //Convert power and toughness to Number since variables are strings
  playerCard1 = {
    ...playerCard1,
    toughness: Number(playerCard1.toughness),
    power: Number(playerCard1.power),
  };
}

function generateCard2() {
  index2 = Math.floor(Math.random() * randomCards.length);

  //While index1 is equal to index2 render new card for index2 with Math.random()
  //Put player 1 card: index1 onto playerCard1 variable
  //Put player 2 card: index2 onto playerCard2 variable
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * randomCards.length);
  }

  playerCard2 = randomCards[index2];
  //Convert power and toughness to Number since variables are strings
  playerCard2 = {
    ...playerCard2,
    toughness: Number(playerCard2.toughness),
    power: Number(playerCard2.power),
  };
}

//Click event to get a new card when it's a tie
getNewCardBtn.addEventListener("click", () => {
  generateCard1();
  textState.style.display = "none";
  attackBtn.disabled = false;
  attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
  //Empty content of player 1 to get a new card
  player1.innerHTML = "";
  player1.innerHTML += `<div id="player-card1"><p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;"><p>Toughness: ${playerCard1.toughness}</p><br/><p>Power: ${playerCard1.power}</p></div>`;
  getNewCardBtn.style.display = "none";
});

//Keep logic for tie in handletie function and call in statements where needed
function handleTie() {
  textState.style.display = "block";
  textState.textContent = "Tie";
  getNewCardBtn.style.display = "block";
  attackBtn.disabled = true;
  attackBtn.style.display = "block";
  attackBtn.style.backgroundColor = "gray";
  playAgainBtn.style.display = "none";
}
//Keep logic for win in handleWin function and call in statements where needed
function handleWin() {
  attackBtn.style.display = "none";
  getNewCardBtn.style.display = "none";
  pointsContainer.style.display = "none";
  playAgainBtn.style.display = "block";
  player1.style.marginRight = "10px";
  textState.textContent = `You won with ${playerCard1.name}! New high score: ${points}`;
  localStorage.setItem("points", points);
}
//Keep logic for game over in handleGameOver function and call in statements where needed
function handleGameOver() {
  textState.textContent = "Game over";
  textState.style.display = "block";
  attackBtn.style.display = "none";
  pointsContainer.style.display = "none";
  playAgainBtn.style.display = "block";
  getNewCardBtn.style.display = "none";
}

// Start game
startGameBtn.addEventListener("click", async () => {
  startGameContainer.style.display = "grid";
  getStoredHighScore = Number(localStorage.getItem("points"));
  startGameBtn.style.display = "none";
  attackBtn.style.display = "block";

  //Get cards
  try {
    const response = await fetch("https://api.magicthegathering.io/v1/cards");
    if (!response.ok) {
      return;
    }
    const result = await response.json();

    // Filter through result.cards to get imgageUrl keys, power/toughness and name keys that exist
    randomCards = result.cards.filter(
      (card) => card.imageUrl && card.power && card.toughness && card.name,
    );
    generateCard1();
    generateCard2();
  } catch (error) {
    console.log(error, "Could not get cards");
  }

  //Create card for player 1
  player1.innerHTML += `<div id="player-card1"><p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;"><p>Toughness: ${playerCard1.toughness}</p><br/><p>Power: ${playerCard1.power}</p></div>`;

  // Create card for player 2
  player2.innerHTML += `<div id="player-card2"><p style="padding-bottom:10px">Your opponent:</p><img src="${playerCard2.imageUrl}"style="height:330px; width: 330px;"><p>Toughness: ${playerCard2.toughness}</p><br/><p>Power: ${playerCard2.power}</p></div>`;

  //Show points from the beginning of the game
  pointsContainer.style.display = "block";
  pointCount.innerHTML = points;

  // State for when player 1 wins the game
  if (points > getStoredHighScore) {
    handleWin();
  }
  //State for game over
  else if (
    points <= 0 &&
    playerCard2.power > playerCard1.power &&
    playerCard2.toughness > playerCard1.toughness
  ) {
    handleGameOver();
  }
  //State for when player 2 has more power and toughness than player 1
  else if (
    playerCard2.power > playerCard1.power &&
    playerCard2.toughness > playerCard1.toughness
  ) {
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = true;
    attackBtn.style.display = "block";
    attackBtn.style.backgroundColor = "gray";
    points = points - 1;
    pointCount.innerHTML = points;
    textState.style.display = "block";
    pointsContainer.style.display = "block";
    textState.textContent = "You lost a point";
    document.getElementById("player-card1").style.animation =
      "opacityShake .5s";
  } //State for when player 1 has more power and toughness than player 2
  else if (
    playerCard1.power > playerCard2.power &&
    playerCard1.toughness > playerCard2.toughness
  ) {
    attackBtn.disabled = false;
    attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
    getNewCardBtn.style.display = "none";
    attackBtn.style.display = "block";
    playAgainBtn.style.display = "none";
    textState.style.display = "block";
    textState.textContent = "One point to you!";
    pointsContainer.style.display = "block";
    points = points + 1;
    pointCount.innerHTML = points;
    document.getElementById("player-card2").style.animation =
      "opacityShake .5s";

    //State when player 1 and player 2 has same cards or if power and toughness for respective card is less than the other players card
  } else {
    handleTie();
  }
});
//Button to attack player 2
attackBtn.addEventListener("click", async () => {
  generateCard2();
  // Empty content of player 2 to then get a new card
  player2.innerHTML = "";
  player2.innerHTML = `<div id="player-card2"><p style="padding-bottom:10px">Your opponent:</p><img src="${playerCard2.imageUrl}"style="height:330px; width: 330px;"><p>Toughness: ${playerCard2.toughness}</p><br/><p>Power: ${playerCard2.power}</p></div>`;

  if (points > getStoredHighScore) {
    handleWin();
  }
  //State for game over
  else if (
    points <= 0 &&
    playerCard2.power > playerCard1.power &&
    playerCard2.toughness > playerCard1.toughness
  ) {
    handleGameOver();
  }
  //State for when player 1 has more power and toughness than player 2
  else if (
    playerCard1.power > playerCard2.power &&
    playerCard1.toughness > playerCard2.toughness
  ) {
    //Increment points if player 1 has more power and toughness than player 2
    attackBtn.disabled = false;
    attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
    getNewCardBtn.style.display = "none";
    attackBtn.style.display = "block";
    playAgainBtn.style.display = "none";
    textState.style.display = "block";
    textState.textContent = "One point to you!";
    pointsContainer.style.display = "block";
    points = points + 1;
    pointCount.innerHTML = points;
    document.getElementById("player-card2").style.animation =
      "opacityShake .5s";
    if (points > getStoredHighScore) {
      handleWin();
    } else {
      textState.style.display = "block";
      textState.textContent = "One point to you!";
    }
  }

  //State for when player 2 has more power and toughness than player 1
  else if (
    playerCard2.power > playerCard1.power &&
    playerCard2.toughness > playerCard1.toughness
  ) {
    playAgainBtn.style.display = "none";
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = true;
    attackBtn.style.display = "block";
    attackBtn.style.backgroundColor = "gray";
    textState.textContent = "You lost a point";
    textState.style.display = "block";
    pointsContainer.style.display = "block";
    points = points - 1;
    pointCount.innerHTML = points;
    document.getElementById("player-card1").style.animation =
      "opacityShake .5s";
  }

  //State for when player 1 and player 2 has same cards or if power and toughness for respective card is less than the other players card
  else {
    handleTie();
  }
});
//Button to start game again
playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});
