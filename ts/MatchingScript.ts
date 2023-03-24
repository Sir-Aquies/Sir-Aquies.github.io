function SizeCheck(input: HTMLInputElement): boolean {
	let size: number = parseInt(input.value);
	const errorMessage: HTMLSpanElement = document.getElementById("error-message");

	if (size % 2 !== 0) {
		input.value = (size + 1).toString();
		errorMessage.innerHTML = "Size must be an even number";
		return false;
	}

	if (size <= 0) {
		input.value = "12";
		errorMessage.innerHTML = "Size can not be negative";
		return false;
	}

	if (size > 1866) {
		errorMessage.innerHTML = "Max size is 1866";
		input.value = "1866";
		return false;
	}

	if (size % 2 === 0) {
		errorMessage.innerHTML = "";
		return true;
	}

	return false;
}

//TODO - Add a way to scroll the game panel easier, loading bar.
//TODO - different API modes.

//(Rows and Columns) Interface that holds the number of rows and columns.
interface RaC {
	rows: number;
	columns: number;
}

function GameCover(height: string) {
	const upperCover = document.getElementById("upper-cover") as HTMLDivElement;
	const lowerCover = document.getElementById("lower-cover") as HTMLDivElement;

	upperCover.style.height = height;
	lowerCover.style.height = height;

	return new Promise<boolean>(resolve => {
		setTimeout(() => { resolve(true) }, 1100);
	});
}

async function StartGame() {
	const sizeInput = document.getElementById("size-input") as HTMLInputElement;

	if (!SizeCheck(sizeInput))
	return;

	const size: number = parseInt(sizeInput.value);

	await GameCover("50%");

	//Hide menu user interface.
	ToggleUserInterface(true);

	const RowsAndCols = CalculateRowsAndColumns(size) as RaC;

	//Pass the size to a top panel element.
	document.getElementById("size-display").innerHTML = `${size} (${RowsAndCols.rows}, ${RowsAndCols.columns})`;

	//create game panel, so when game is completed just call .remove() and delete it along with its children.
	const gamePanel = document.createElement("div") as HTMLDivElement;
	gamePanel.id = "game-panel";
	gamePanel.className = "game-panel";
	document.getElementById("background").appendChild(gamePanel);

	CreateCards(RowsAndCols, size, gamePanel);
}

interface CardContainer extends HTMLDivElement {
	cover: HTMLDivElement;
	card: Card;
}

interface Card extends HTMLDivElement {
	//secretId will contain a number to identify pairs when clicked.
	secretId: number;
	//If pairs are found complete will be equal to true, default is false.
	complete: boolean;
}

//Array that will contain all the cards when game starts.
const gameCards: Card[] = [];

function CreateCards(RowsACols: RaC, size: number, panel: HTMLDivElement): void {
	//Empty array.
	gameCards.splice(0, gameCards.length);

	//Create rows and colums, add the respective classes and append the columns to the rows and the rows to the game panel.
	CreateRowsAndColumns(RowsACols, size, panel);

	//Just shuffle the array of cards with a method that I found on StackOverflow.
	Shuffle(gameCards);

	//Set the secretId, complete and image fields to the cards in pairs.
	const idArray: number[] = [];
	for (var i = 0; i < gameCards.length / 2; i++) {
		const card1 = gameCards[i];
		//One way to get the second card for the pair.
		const card2 = gameCards[i + gameCards.length / 2];

		card1.complete = false;
		card2.complete = false;

		SetCardsSecretId(card1, card2, idArray);
		
		//Set the background image of the cards.
		getPicsum(`https://picsum.photos/v2/list?page=${ card1.secretId }&limit=1`, (imageId: number) => {
			//Use the id to get a downgraded in quality version of the image.
			card1.style.backgroundImage = `url(https://picsum.photos/id/${ imageId }/${ card1.offsetWidth }/${ card1.offsetHeight })`;
			card2.style.backgroundImage = card1.style.backgroundImage;
		});
		
		//When the last card is created.
		if (i + 1 === gameCards.length / 2) {
			//Create image and add a load event to it.
			var image = new Image();
			image.addEventListener("load", async function () {
				//When image is loaded remove game cover and remove image.
				//The point is if last image is loaded that means all other image are loaded too.
				await GameCover("0")
				this.remove();
			});
			//Attach the last card source image.
			image.src = `https://picsum.photos/${card1.offsetWidth + 100}/${card1.offsetHeight + 100}?random&secId=${card1.secretId}`;
		}
	}

	function CreateRowsAndColumns(RowsACols: RaC, size: number, panel: HTMLDivElement) {
		// Create cards until either the specified size or the maximum number of cards is reached
		let count = 0;
		for (let i = 0; i < RowsACols.rows && count < size; i++) {
		  const row = document.createElement("div") as HTMLDivElement;
		  row.className = "rows";
		  row.id = count.toString();

		  for (let j = 0; j < RowsACols.columns && count < size; j++) {
			const cardContainer = document.createElement("div") as CardContainer;
			cardContainer.className = "card-container";
	  
			const card = document.createElement("div") as Card;
			card.className = "cards";
			cardContainer.card = card;
			cardContainer.appendChild(card);
	  
			const cover = document.createElement("div") as HTMLDivElement;
			cover.className = "card-cover";
			cardContainer.cover = cover;
			cardContainer.appendChild(cover);
	  
			cardContainer.onclick = function () {
			  CompareCard(cardContainer);
			};
	  
			gameCards.push(card);
			row.appendChild(cardContainer);
			count++;
		  }
	  
		  panel.appendChild(row);
		}
	}

	function SetCardsSecretId(card1: Card, card2: Card, idArray: Number[]) {
		do {
			//Set the secretId
			card1.secretId = Math.floor(Math.random() * 994);
			card2.secretId = card1.secretId;

			//Find if the id is repeated.
			if (idArray.find(value => value === card1.secretId) !== undefined) {
				card1.secretId = -1;
			}
			else {
				idArray.push(card1.secretId);
			}
		}
		while (card1.secretId === -1)
	}
}

function getPicsum(url: string, callback: Function) {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url);
	xhttp.responseType = 'json';

	xhttp.onload = function () {
		const [data] = this.response;
		let imageURL = data.download_url as string;
		//Use the id of the response.
		callback(imageURL.split('/')[4]);
	}

	xhttp.send();
}

//Array that will contain the card containers when click, only two.
const comparePair: CardContainer[] = [];

async function CompareCard(cardContainer: CardContainer) {
	var finnishGame: boolean = false;

	//Add card container to compare array, remove the click event and flip the container.
	comparePair.push(cardContainer);
	cardContainer.onclick = null;
	cardContainer.style.transform = "rotateY(180deg)";

	//when there two cards in the aray, compare their secretId value.
	if (comparePair.length === 2) {
		const cardContainer1 = comparePair[0];
		const cardContainer2 = comparePair[1];

		//if secretId values coincided set complete to true.
		if (cardContainer1.card.secretId === cardContainer2.card.secretId) {
			cardContainer1.card.complete = true;
			cardContainer2.card.complete = true;

			//Checks every complete property in the cards array, if its equal to true set finnishGame variable to true.
			finnishGame = gameCards.every(function (value) {
				return value.complete === true;
			});
		}
		else {
			//Return the card container back to normal after a moment.
			setTimeout(function () {
				cardContainer1.style.transform = "rotateY(0deg)";
				cardContainer2.style.transform = "rotateY(0deg)";

				//Return the onclick event to both of the containers.
				cardContainer1.onclick = function () {
					CompareCard(cardContainer1);
				};
				cardContainer2.onclick = function () {
					CompareCard(cardContainer2);
				};

				// return new Promise<boolean>(resolve => {
				// 	resolve(true)
				// });
			}, 500)
		}

		//Always empty compare array.
		comparePair.splice(0, comparePair.length)
		//Increase the moves by one when two cards are compare.
		document.getElementById("total-moves").innerHTML = (parseInt(document.getElementById("total-moves").innerHTML) + 1).toString();

		if (finnishGame) {
			CompleteGame();
		}
	}
}

//Function that will execute when game is completed.
async function CompleteGame() {
	await GameCover("50%");

	//Delete the game panel along with its children.
	document.getElementById("game-panel").remove();
	//Empty array.
	gameCards.splice(0, gameCards.length);

	//Pass the amount of moves made to the second menu.
	let moves = document.getElementById("total-moves").innerHTML;
	document.getElementById("total-moves").innerHTML = "0";

	if (moves === "1") {
		document.getElementById("total-moves-finnish").innerHTML = moves + " move";
	}
	else {
		document.getElementById("total-moves-finnish").innerHTML = moves + " moves";
	}

	//Pass the size to the second menu.
	document.getElementById("size-display-finnish").innerHTML = document.getElementById("size-display").innerHTML;

	//Show menu user interface and second menu.
	ToggleUserInterface(false, true);

	await GameCover("0");
}

//When the reset button is clicked
async function ResetGame() {
	await GameCover("50%");
	document.getElementById("game-panel").remove();
	gameCards.splice(0, gameCards.length);

	//Show menu user interface.
	ToggleUserInterface(false);

	await GameCover("0");
}

function ToggleUserInterface(toggle: boolean, ShowSecondMenu = false) {
	document.getElementById("top-panel").style.display = toggle ? "flex" : "none";
	document.getElementById("center-tab").style.display = toggle ? "none" : "grid";
	document.getElementById("menu").style.display = toggle ? "none" : "flex";

	document.getElementById("total-moves").innerHTML = "0";

	if (ShowSecondMenu) {
		document.getElementById("second-menu").style.display = "flex";
		document.getElementById("menu").style.display = "none";
	}
	else {
		document.getElementById("second-menu").style.display = "none";
	}
}
  
function CalculateRowsAndColumns(num: number): RaC {
	const sqrt = Math.sqrt(num);
	let rows = Math.floor(sqrt);
	let columns = Math.ceil(sqrt);

	while (rows * columns < num) {
		rows++;
	}

	return { rows, columns };
}

function Shuffle(array: Card[]) {
	let currentIndex = array.length, randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
}