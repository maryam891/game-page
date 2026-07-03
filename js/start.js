let showCardsBtn = document.getElementById("showCards-btn");
let closeCardsBtn = document.getElementById("closeCards-btn");
let backgroundImg = document.querySelector("#background-img");
let homepageHeader = document.querySelector("#homepage-header");
let magicCardContainer = document.querySelector("#magicCardsContainer");

// click show Magic cards button to recive cards
showCardsBtn.addEventListener("click", async () => {
  //Get the cards
  try {
    const response = await fetch("https://api.magicthegathering.io/v1/cards");
    if (!response.ok) {
      return;
    }
    const result = await response.json();

    showCardsBtn.style.display = "none";
    closeCardsBtn.style.display = "block";
    backgroundImg.style.display = "none";
    magicCardContainer.style.display = "grid";
    homepageHeader.style.display = "block";

    for (let i = 0; i < 33; i++) {
      //Check for cards that have imageUrl key
      if (result.cards[i].imageUrl != undefined) {
        //Create div and img element that will be the cards added to magicCardContainer
        const card = document.createElement("div");
        card.classList.add("cards");
        const image = document.createElement("img");
        image.src = result.cards[i].imageUrl;
        image.alt = result.cards[i].name;
        card.appendChild(image);
        magicCardContainer.appendChild(card);
      }
    }
  } catch (error) {
    console.log(error, "could not get cards");
  }
});

closeCardsBtn.addEventListener("click", () => {
  // Make everything back to default when clicking on close cards
  showCardsBtn.style.display = "block";
  closeCardsBtn.style.display = "none";
  magicCardContainer.style.display = "none";
  homepageHeader.style.display = "none";
  backgroundImg.style.display = "block";
});
