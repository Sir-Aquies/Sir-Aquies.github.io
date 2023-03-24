var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function SizeCheck(input) {
    var size = parseInt(input.value);
    var errorMessage = document.getElementById("error-message");
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
function GameCover(height) {
    var upperCover = document.getElementById("upper-cover");
    var lowerCover = document.getElementById("lower-cover");
    upperCover.style.height = height;
    lowerCover.style.height = height;
    return new Promise(function (resolve) {
        setTimeout(function () { resolve(true); }, 1100);
    });
}
function StartGame() {
    return __awaiter(this, void 0, void 0, function () {
        var sizeInput, size, RowsAndCols, gamePanel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sizeInput = document.getElementById("size-input");
                    if (!SizeCheck(sizeInput))
                        return [2 /*return*/];
                    size = parseInt(sizeInput.value);
                    return [4 /*yield*/, GameCover("50%")];
                case 1:
                    _a.sent();
                    //Hide menu user interface.
                    ToggleUserInterface(true);
                    RowsAndCols = CalculateRowsAndColumns(size);
                    //Pass the size to a top panel element.
                    document.getElementById("size-display").innerHTML = "".concat(size, " (").concat(RowsAndCols.rows, ", ").concat(RowsAndCols.columns, ")");
                    gamePanel = document.createElement("div");
                    gamePanel.id = "game-panel";
                    gamePanel.className = "game-panel";
                    document.getElementById("background").appendChild(gamePanel);
                    CreateCards(RowsAndCols, size, gamePanel);
                    return [2 /*return*/];
            }
        });
    });
}
//Array that will contain all the cards when game starts.
var gameCards = [];
function CreateCards(RowsACols, size, panel) {
    //Empty array.
    gameCards.splice(0, gameCards.length);
    //Create rows and colums, add the respective classes and append the columns to the rows and the rows to the game panel.
    CreateRowsAndColumns(RowsACols, size, panel);
    //Just shuffle the array of cards with a method that I found on StackOverflow.
    Shuffle(gameCards);
    //Set the secretId, complete and image fields to the cards in pairs.
    var idArray = [];
    var _loop_1 = function () {
        var card1 = gameCards[i];
        //One way to get the second card for the pair.
        var card2 = gameCards[i + gameCards.length / 2];
        card1.complete = false;
        card2.complete = false;
        SetCardsSecretId(card1, card2, idArray);
        //Set the background image of the cards.
        getPicsum("https://picsum.photos/v2/list?page=".concat(card1.secretId, "&limit=1"), function (imageId) {
            //Use the id to get a downgraded in quality version of the image.
            card1.style.backgroundImage = "url(https://picsum.photos/id/".concat(imageId, "/").concat(card1.offsetWidth, "/").concat(card1.offsetHeight, ")");
            card2.style.backgroundImage = card1.style.backgroundImage;
        });
        //When the last card is created.
        if (i + 1 === gameCards.length / 2) {
            //Create image and add a load event to it.
            image = new Image();
            image.addEventListener("load", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            //When image is loaded remove game cover and remove image.
                            //The point is if last image is loaded that means all other image are loaded too.
                            return [4 /*yield*/, GameCover("0")];
                            case 1:
                                //When image is loaded remove game cover and remove image.
                                //The point is if last image is loaded that means all other image are loaded too.
                                _a.sent();
                                this.remove();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            //Attach the last card source image.
            image.src = "https://picsum.photos/".concat(card1.offsetWidth + 100, "/").concat(card1.offsetHeight + 100, "?random&secId=").concat(card1.secretId);
        }
    };
    var image;
    for (var i = 0; i < gameCards.length / 2; i++) {
        _loop_1();
    }
    function CreateRowsAndColumns(RowsACols, size, panel) {
        // Create cards until either the specified size or the maximum number of cards is reached
        var count = 0;
        for (var i_1 = 0; i_1 < RowsACols.rows && count < size; i_1++) {
            var row = document.createElement("div");
            row.className = "rows";
            row.id = count.toString();
            var _loop_2 = function (j) {
                var cardContainer = document.createElement("div");
                cardContainer.className = "card-container";
                var card = document.createElement("div");
                card.className = "cards";
                cardContainer.card = card;
                cardContainer.appendChild(card);
                var cover = document.createElement("div");
                cover.className = "card-cover";
                cardContainer.cover = cover;
                cardContainer.appendChild(cover);
                cardContainer.onclick = function () {
                    CompareCard(cardContainer);
                };
                gameCards.push(card);
                row.appendChild(cardContainer);
                count++;
            };
            for (var j = 0; j < RowsACols.columns && count < size; j++) {
                _loop_2(j);
            }
            panel.appendChild(row);
        }
    }
    function SetCardsSecretId(card1, card2, idArray) {
        do {
            //Set the secretId
            card1.secretId = Math.floor(Math.random() * 994);
            card2.secretId = card1.secretId;
            //Find if the id is repeated.
            if (idArray.find(function (value) { return value === card1.secretId; }) !== undefined) {
                card1.secretId = -1;
            }
            else {
                idArray.push(card1.secretId);
            }
        } while (card1.secretId === -1);
    }
}
function getPicsum(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url);
    xhttp.responseType = 'json';
    xhttp.onload = function () {
        var data = this.response[0];
        var imageURL = data.download_url;
        //Use the id of the response.
        callback(imageURL.split('/')[4]);
    };
    xhttp.send();
}
//Array that will contain the card containers when click, only two.
var comparePair = [];
function CompareCard(cardContainer) {
    return __awaiter(this, void 0, void 0, function () {
        var finnishGame, cardContainer1_1, cardContainer2_1;
        return __generator(this, function (_a) {
            finnishGame = false;
            //Add card container to compare array, remove the click event and flip the container.
            comparePair.push(cardContainer);
            cardContainer.onclick = null;
            cardContainer.style.transform = "rotateY(180deg)";
            //when there two cards in the aray, compare their secretId value.
            if (comparePair.length === 2) {
                cardContainer1_1 = comparePair[0];
                cardContainer2_1 = comparePair[1];
                //if secretId values coincided set complete to true.
                if (cardContainer1_1.card.secretId === cardContainer2_1.card.secretId) {
                    cardContainer1_1.card.complete = true;
                    cardContainer2_1.card.complete = true;
                    //Checks every complete property in the cards array, if its equal to true set finnishGame variable to true.
                    finnishGame = gameCards.every(function (value) {
                        return value.complete === true;
                    });
                }
                else {
                    //Return the card container back to normal after a moment.
                    setTimeout(function () {
                        cardContainer1_1.style.transform = "rotateY(0deg)";
                        cardContainer2_1.style.transform = "rotateY(0deg)";
                        //Return the onclick event to both of the containers.
                        cardContainer1_1.onclick = function () {
                            CompareCard(cardContainer1_1);
                        };
                        cardContainer2_1.onclick = function () {
                            CompareCard(cardContainer2_1);
                        };
                        // return new Promise<boolean>(resolve => {
                        // 	resolve(true)
                        // });
                    }, 500);
                }
                //Always empty compare array.
                comparePair.splice(0, comparePair.length);
                //Increase the moves by one when two cards are compare.
                document.getElementById("total-moves").innerHTML = (parseInt(document.getElementById("total-moves").innerHTML) + 1).toString();
                if (finnishGame) {
                    CompleteGame();
                }
            }
            return [2 /*return*/];
        });
    });
}
//Function that will execute when game is completed.
function CompleteGame() {
    return __awaiter(this, void 0, void 0, function () {
        var moves;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GameCover("50%")];
                case 1:
                    _a.sent();
                    //Delete the game panel along with its children.
                    document.getElementById("game-panel").remove();
                    //Empty array.
                    gameCards.splice(0, gameCards.length);
                    moves = document.getElementById("total-moves").innerHTML;
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
                    return [4 /*yield*/, GameCover("0")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//When the reset button is clicked
function ResetGame() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GameCover("50%")];
                case 1:
                    _a.sent();
                    document.getElementById("game-panel").remove();
                    gameCards.splice(0, gameCards.length);
                    //Show menu user interface.
                    ToggleUserInterface(false);
                    return [4 /*yield*/, GameCover("0")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ToggleUserInterface(toggle, ShowSecondMenu) {
    if (ShowSecondMenu === void 0) { ShowSecondMenu = false; }
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
function CalculateRowsAndColumns(num) {
    var sqrt = Math.sqrt(num);
    var rows = Math.floor(sqrt);
    var columns = Math.ceil(sqrt);
    while (rows * columns < num) {
        rows++;
    }
    return { rows: rows, columns: columns };
}
function Shuffle(array) {
    var _a;
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = [
            array[randomIndex], array[currentIndex]
        ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
}
//# sourceMappingURL=MatchingScript.js.map