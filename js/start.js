let showCardsBtn = document.getElementById("showCards-btn");
let closeCardsBtn = document.getElementById("closeCards-btn");
let backgroundImg = document.querySelector("#background-img");
let homepageHeader = document.querySelector("#homepage-header");
let magicCardContainer = document.querySelector("#magicCardsContainer");

// click show Magic cards button to recive cards
showCardsBtn.addEventListener("click", () => {
  //Get the cards
  fetch("https://api.magicthegathering.io/v1/cards")
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      showCardsBtn.style.display = "none";
      closeCardsBtn.style.display = "block";
      backgroundImg.style.display = "none";
      magicCardContainer.style.display = "grid";
      homepageHeader.style.display = "block";

      for (let i = 0; i < 33; i++) {
        //Check for cards that have imageUrl key
        if (result.cards[i].imageUrl != undefined) {
          magicCardContainer.innerHTML += `<div style="height:auto; width:auto;"><img src="${result.cards[i].imageUrl}" style="height:400px; width: 360px;"></div`;
        }
      }
    });
});

closeCardsBtn.addEventListener("click", () => {
  // Make everything back to default when clicking on close cards
  showCardsBtn.style.display = "block";
  closeCardsBtn.style.display = "none";
  magicCardContainer.style.display = "none";
  homepageHeader.style.display = "none";
  backgroundImg.style.display = "block";
});
