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
let pointCountText = document.querySelector(".pointsCountText");
let getNewCardBtn = document.getElementById("getNewCardBtn");
let points = 0;
let textState = document.createElement("h2");
startGameContainer.appendChild(textState);
textState.style.display = "none";
attackBtn.setAttribute("disabled", false);

// Button shows game rules overlay
gameRulesBtn.addEventListener("click", () => {
  gameRulesContainer.style.display = "block";
  backgroundImg.style.display = "block";
});

// Button for closing the game rules overlay
closeOverlayBtn.addEventListener("click", () => {
  gameRulesContainer.style.display = "none";
});
//Declare outside to access outside of function
let playerCard1;
let playerCard2;
let randomCards;

async function shuffle() {
  //Shuffle cards to get random cards
  for (let i = randomCards.length - 1; i > 0; i--) {
    let orgValue = randomCards[i];
    let j = Math.floor(Math.random() * (i + 1));
    randomCards[i] = randomCards[j];
    randomCards[j] = orgValue;
    //Put player 1 card: i onto playerCard1 variable
    playerCard1 = randomCards[i];
    //Put player 2 card: j onto playerCard2 variable
    playerCard2 = randomCards[j];
  }
}
// Start game
startGameBtn.addEventListener("click", async () => {
  startGameContainer.style.display = "grid";
  startGameBtn.style.display = "none";
  attackBtn.style.display = "block";

  //Get cards api
  const response = await fetch("https://api.magicthegathering.io/v1/cards");
  const result = await response.json();
  console.log(result);
  // Filter through result.cards to get imgageUrl keys and power keys that exist
  randomCards = result.cards.filter(
    (card) => card.imageUrl && card.power && card.toughness
  );
  await shuffle();

  //Create card for player 1
  player1.innerHTML += `<p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;">;`;

  // Create card for player 2
  player2.innerHTML += `<p style="padding-bottom:10px">Your opponent:</p><img src="${playerCard2.imageUrl}"style="height:330px; width: 330px;">;`;

  //Show points from the beginning of the game
  pointCountText.style.display = "block";
  pointCount.innerHTML = points;
  pointCount.style.display = "block";

  //State when player 2 has more power than player 1
  if (
    playerCard2.power > playerCard1.power ||
    playerCard2.toughness > playerCard1.toughness
  ) {
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = true;
    attackBtn.style.display = "block";
    attackBtn.style.backgroundColor = "gray";

    // Also check if points is more than 0 to be able to decrement points
    if (points > 0) {
      pointCount.style.display = "block";
      points = points - 1;
      pointCount.innerHTML = points;
      textState.style.display = "block";
      pointCountText.style.display = "block";
      textState.textContent = "You lost a point";
    }

    //Click button to get a new card
    getNewCardBtn.addEventListener("click", () => {
      textState.style.display = "none";
      attackBtn.disabled = false;
      attackBtn.style.display = "block";
      attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
      //Empty content of player 1 to get a new card
      player1.innerHTML = "";
      player1.innerHTML += `<p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;">;`;
      getNewCardBtn.style.display = "none";
    });
  } //State when player 1 has more power than player 2
  else if (
    playerCard1.power > playerCard2.power ||
    playerCard1.toughness > playerCard2.toughness
  ) {
    attackBtn.disabled = false;
    attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
    getNewCardBtn.style.display = "none";
    attackBtn.style.display = "block";
    playAgainBtn.style.display = "none";
    // Check if points is more than 0 when the game starts to show the message
    if (points > 0) {
      textState.style.display = "block";
      textState.textContent = "One point to you!";
      pointCountText.style.display = "block";
      pointCount.style.display = "block";
      points = points + 1;
      pointCount.innerHTML = points;
    }

    //State when player 1 and player 2 has same cards
  } else if (
    playerCard1.power === playerCard2.power &&
    playerCard1.toughness === playerCard2.toughness
  ) {
    textState.style.display = "block";
    textState.textContent = "Tie";
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = "true";
    attackBtn.style.backgroundColor = "gray";
    playAgainBtn.style.display = "none";
    //Click to get new card
    getNewCardBtn.addEventListener("click", () => {
      textState.style.display = "none";
      attackBtn.disabled = false;
      attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
      //Empty content of player 1 to get a new card
      player1.innerHTML = "";

      player1.innerHTML += `<p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;">;`;
      getNewCardBtn.style.display = "none";
    });
  }

  // State when player 1 wins the game
  else if (points >= 10) {
    textState.style.display = "block";
    textState.textContent = "You won!";
    attackBtn.style.display = "none";
    getNewCardBtn.style.display = "none";
    playAgainBtn.style.display = "block";
    player1.style.marginRight = "10px";
    pointCount.gridCoulmnStart = "2";
  }
  //State for game over
  else if (
    (points <= 0 && playerCard2.power > playerCard1.power) ||
    (points <= 0 && playerCard2.toughness > playerCard1.toughness)
  ) {
    points = points - 1;
    pointCount.innerHTML = points;
    textState.textContent = "Game over";
    textState.style.display = "block";
    attackBtn.style.display = "none";
    playAgainBtn.style.display = "block";
    pointCountText.style.display = "none";
    getNewCardBtn.style.display = "none";
    pointCount.style.display = "none";
  }
});
//Button to attack player 2
attackBtn.addEventListener("click", async () => {
  const response = await fetch("https://api.magicthegathering.io/v1/cards");
  const result = await response.json();
  // Filter through result.cards to get imgageUrl keys and power keys that exist
  randomCards = result.cards.filter(
    (card) => card.imageUrl && card.power && card.toughness
  );
  await shuffle();

  // Empty content of player 2 to then get a new card
  player2.innerHTML = "";

  player2.innerHTML = `<p style="padding-bottom:10px">Your opponent:</p><img src="${playerCard2.imageUrl}"style="height:330px; width: 330px;">;`;

  //State when player 1 has more power than player 2
  if (
    playerCard1.power > playerCard2.power ||
    playerCard1.toughness > playerCard2.toughness
  ) {
    //Increment points if player 1 has more power than player 2
    attackBtn.disabled = false;
    attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
    getNewCardBtn.style.display = "none";
    attackBtn.style.display = "block";
    playAgainBtn.style.display = "none";
    // Check if points is more than or equal to 0 since the points will get incremented when clicking on the attackbtn
    if (points >= 0) {
      textState.style.display = "block";
      textState.textContent = "One point to you!";
      pointCountText.style.display = "block";
      pointCount.style.display = "block";
      points = points + 1;
      pointCount.innerHTML = points;
    }
  }

  //State for game over
  else if (
    (points <= 0 && playerCard2.power > playerCard1.power) ||
    (points <= 0 && playerCard2.toughness > playerCard1.toughness)
  ) {
    textState.style.display = "block";
    textState.textContent = "Game over";
    attackBtn.style.display = "none";
    playAgainBtn.style.display = "block";
    pointCountText.style.display = "none";
    getNewCardBtn.style.display = "none";
    pointCount.style.display = "none";
    points = points - 1;
    pointCount.innerHTML = points;
  }

  // State when player 2 has more power than player 1
  else if (
    playerCard2.power > playerCard1.power ||
    playerCard2.toughness > playerCard1.toughness
  ) {
    playAgainBtn.style.display = "none";
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = true;
    attackBtn.style.display = "block";
    attackBtn.style.backgroundColor = "gray";

    // Also check if points is more than 0 to be able to decrement points
    if (points > 0) {
      textState.textContent = "You lost a point";
      textState.style.display = "block";
      pointCountText.style.display = "block";
      pointCount.style.display = "block";
      points = points - 1;
      pointCount.innerHTML = points;
    }

    //Click button to get a new card
    getNewCardBtn.addEventListener("click", () => {
      textState.style.display = "none";
      attackBtn.disabled = false;
      attackBtn.style.display = "block";
      attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
      player1.innerHTML = "";

      player1.innerHTML += `<p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;">;`;
      getNewCardBtn.style.display = "none";
    });
  }
  // State when player 1 wins the game
  else if (points >= 10) {
    textState.style.display = "block";
    textState.textContent = "You won!";
    playAgainBtn.style.display = "block";
    getNewCardBtn.style.display = "none";
    attackBtn.style.display = "none";
    player1.style.marginRight = "10px";
    pointCount.gridCoulmnStart = "2";
  }

  //State when player 1 and player 2 has same cards
  else if (
    playerCard1.power === playerCard2.power &&
    playerCard1.toughness === playerCard2.toughness
  ) {
    textState.style.display = "block";
    textState.textContent = "Tie";
    getNewCardBtn.style.display = "block";
    attackBtn.disabled = "true";
    attackBtn.style.display = "block";
    attackBtn.style.backgroundColor = "gray";
    playAgainBtn.style.display = "none";

    //Click button to get a new card
    getNewCardBtn.addEventListener("click", () => {
      textState.style.display = "none";
      attackBtn.disabled = false;
      attackBtn.style.backgroundColor = "rgb(49, 49, 102)";
      //Empty content of player 1 to get a new card
      player1.innerHTML = "";

      player1.innerHTML += `<p style="padding-bottom:10px">Your card:</p><img src="${playerCard1.imageUrl}"style="height:330px; width: 330px;">;`;
      getNewCardBtn.style.display = "none";
    });
  }
});
//Button to start game again
playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});
