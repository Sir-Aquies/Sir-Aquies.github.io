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
        while (_) try {
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
function InputCheck(input) {
    var size = parseInt(input.value);
    var error = document.getElementById("error");
    if (size % 2 !== 0) {
        input.value = (size + 1).toString();
        error.innerHTML = "Size must be an even number";
        return false;
    }
    if (size <= 0) {
        input.value = "12";
        error.innerHTML = "Size can not be negative";
        return false;
    }
    if (size > 1866) {
        error.innerHTML = "Max size is 1866";
        input.value = "1866";
        return false;
    }
    if (size % 2 === 0) {
        error.innerHTML = "";
        return true;
    }
    return false;
}
function GameCover(width) {
    var upperCover = document.getElementById("upper-cover");
    var lowerCover = document.getElementById("lower-cover");
    upperCover.style.height = width;
    lowerCover.style.height = width;
    return new Promise(function (resolve) {
        setTimeout(function () { resolve(true); }, 1000);
    });
}
function StartGame() {
    return __awaiter(this, void 0, void 0, function () {
        var sizeInput, size, centerTab, menu, RowsACols, gamePanel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sizeInput = document.getElementById("size-input");
                    if (!InputCheck(sizeInput)) return [3 /*break*/, 2];
                    size = parseInt(sizeInput.value);
                    return [4 /*yield*/, GameCover("50%")];
                case 1:
                    _a.sent();
                    centerTab = document.getElementById("center-tab");
                    centerTab.style.display = "none";
                    menu = document.getElementById("menu");
                    menu.style.display = "none";
                    RowsACols = CalculateRowsAndColumns(size);
                    document.getElementById("size-display").innerHTML = size.toString();
                    document.getElementById("right-panel").style.display = "flex";
                    gamePanel = document.createElement("div");
                    gamePanel.id = "game-panel";
                    gamePanel.className = "game-panel";
                    document.getElementById("background").appendChild(gamePanel);
                    CreateCards(RowsACols, gamePanel);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
//Array that will contain all the cards when game is started.
var cards = [];
function CreateCards(RowsACols, panel) {
    cards.splice(0, cards.length);
    //Create rows and colums, add the respective classes and appendChild the columns to the rows and the rows to the game panel.
    for (var i_1 = 0; i_1 < RowsACols.rows; i_1++) {
        var row = document.createElement("div");
        row.className = "rows";
        var _loop_1 = function (j) {
            var cardContainer = document.createElement("div");
            var card = document.createElement("div");
            card.className = "cards";
            var cover = document.createElement("div");
            cover.className = "card-cover";
            //Add card and cover to the container as well as the properties and the click event.
            cardContainer.className = "card-container";
            cardContainer.card = card;
            cardContainer.appendChild(card);
            cardContainer.cover = cover;
            cardContainer.appendChild(cover);
            cardContainer.onclick = function () {
                CompareCard(cardContainer);
            };
            cards.push(card);
            row.appendChild(cardContainer);
        };
        for (var j = 0; j < RowsACols.columns; j++) {
            _loop_1(j);
        }
        panel.appendChild(row);
    }
    //Just shuffle the array cards with a method that I found on StackOverflow.
    shuffle(cards);
    //Add secretId, complete and image values to the cards.
    //This is done in pairs using half of the array.
    var idArray = [];
    var _loop_2 = function () {
        var card1 = cards[i];
        var card2 = cards[i + cards.length / 2];
        do {
            card1.secretId = Math.floor(Math.random() * 994);
            card2.secretId = card1.secretId;
            if (idArray.find(function (value) { return value === card1.secretId; }) !== undefined) {
                card1.secretId = -1;
            }
            else {
                idArray.push(card1.secretId);
            }
        } while (card1.secretId === -1);
        card1.complete = false;
        card2.complete = false;
        var array = [card1, card2];
        getJSON("https://picsum.photos/v2/list?page=".concat(card1.secretId, "&limit=1"), array);
        //when the last card is created.
        if (i + 1 === cards.length / 2) {
            //create image and add a load event to it.
            image = new Image();
            image.addEventListener("load", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            //when image is loaded remove game cover and remove image.
                            //The point is if last image is loaded that means all other image are loaded too.
                            return [4 /*yield*/, GameCover("0")];
                            case 1:
                                //when image is loaded remove game cover and remove image.
                                //The point is if last image is loaded that means all other image are loaded too.
                                _a.sent();
                                this.remove();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            //attach the last card source image.
            image.src = "https://picsum.photos/".concat(card1.offsetWidth, "/").concat(card1.offsetHeight, "?random&secId=").concat(card1.secretId);
        }
    };
    var image;
    for (var i = 0; i < cards.length / 2; i++) {
        _loop_2();
    }
}
function getJSON(url, array) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url);
    xhttp.responseType = 'json';
    xhttp.onload = function () {
        var data = this.response[0];
        var url = data.download_url;
        for (var i = 0; i < array.length; i++) {
            array[i].style.backgroundImage = "url(https://picsum.photos/id/".concat(url.split('/')[4], "/").concat(array[i].offsetWidth, "/").concat(array[i].offsetHeight, ")");
        }
    };
    xhttp.send();
}
//Array that will contain the card containers when click, only two.
var compare = [];
//TODO - fix error when card are click to quick.
function CompareCard(cardContainer) {
    return __awaiter(this, void 0, void 0, function () {
        var finnishGame, cardContainer1_1, cardContainer2_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finnishGame = false;
                    //Add card container to compare array, remove the click event and flip the container.
                    compare.push(cardContainer);
                    cardContainer.onclick = null;
                    cardContainer.style.transform = "rotateY(180deg)";
                    if (!(compare.length === 2)) return [3 /*break*/, 4];
                    cardContainer1_1 = compare[0];
                    cardContainer2_1 = compare[1];
                    if (!(cardContainer1_1.card.secretId === cardContainer2_1.card.secretId)) return [3 /*break*/, 1];
                    cardContainer1_1.card.complete = true;
                    cardContainer2_1.card.complete = true;
                    //Checks every complete property in the cards array, if its equal to true set finnishGame variable to true.
                    finnishGame = cards.every(function (value) {
                        return value.complete === true;
                    });
                    return [3 /*break*/, 3];
                case 1:
                    //if secretId value are not equal return onclick event to both of the containers.
                    cardContainer1_1.onclick = function () {
                        CompareCard(cardContainer1_1);
                    };
                    cardContainer2_1.onclick = function () {
                        CompareCard(cardContainer2_1);
                    };
                    //Rotate container back to 0 deg after 500ms.
                    return [4 /*yield*/, setTimeout(function () {
                            cardContainer1_1.style.transform = "rotateY(0deg)";
                            cardContainer2_1.style.transform = "rotateY(0deg)";
                            return new Promise(function (resolve) {
                                resolve(true);
                            });
                        }, 500)];
                case 2:
                    //Rotate container back to 0 deg after 500ms.
                    _a.sent();
                    _a.label = 3;
                case 3:
                    //Always empty compare array.
                    compare.splice(0, compare.length);
                    //Increase the moves by one when two cards are compare.
                    document.getElementById("total-moves").innerHTML = (parseInt(document.getElementById("total-moves").innerHTML) + 1).toString();
                    //if finnishGame is true call CompleteGame function.
                    if (finnishGame) {
                        CompleteGame();
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//function that will execute when game is completed.
function CompleteGame() {
    return __awaiter(this, void 0, void 0, function () {
        var secondMenu, moves;
        return __generator(this, function (_a) {
            document.getElementById("game-panel").remove();
            cards.splice(0, cards.length);
            document.getElementById("right-panel").style.display = "none";
            secondMenu = document.getElementById("second-menu");
            document.getElementById("center-tab").style.display = "flex";
            secondMenu.style.display = "block";
            moves = document.getElementById("total-moves").innerHTML;
            document.getElementById("total-moves").innerHTML = "0";
            if (moves === "1") {
                document.getElementById("total-moves-finnish").innerHTML = moves + " move";
            }
            else {
                document.getElementById("total-moves-finnish").innerHTML = moves + " moves";
            }
            document.getElementById("size-display-finnish").innerHTML = document.getElementById("size-display").innerHTML;
            return [2 /*return*/];
        });
    });
}
function ResetGame() {
    return __awaiter(this, void 0, void 0, function () {
        var menu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GameCover("50%")];
                case 1:
                    _a.sent();
                    document.getElementById("game-panel").remove();
                    cards.splice(0, cards.length);
                    document.getElementById("right-panel").style.display = "none";
                    document.getElementById("second-menu").style.display = 'none';
                    document.getElementById("total-moves").innerHTML = "0";
                    document.getElementById("center-tab").style.display = "flex";
                    menu = document.getElementById("menu");
                    menu.style.display = "block";
                    return [4 /*yield*/, GameCover("0")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function CalculateRowsAndColumns(size) {
    var divisors = [];
    //if size is 2 just return this value, the method can't figure it out 2.
    if (size === 2) {
        return { rows: 1, columns: 2 };
    }
    //find all the divisor of size. (there is maybe not need for an array, but is more readable)
    for (var i = 2; i < size; i++) {
        if (size % i === 0) {
            divisors.push(i);
        }
    }
    var pairs = [];
    //finds the pairs of divisors that when multiplicated return the size.
    divisors.forEach(function (value, index, array) {
        for (var i = 0; i < array.length; i++) {
            if (value * array[i] === size) {
                //Columns have to be bigger than rows.
                if (value >= array[i]) {
                    var pair = { rows: array[i], columns: value };
                    pairs.push(pair);
                }
            }
        }
    });
    var output = { rows: pairs[0].rows, columns: pairs[0].columns };
    //find the pair whose values a the closest by calculating the average, that is the lowest average.
    pairs.forEach(function (value) {
        var average = (output.rows + output.columns) / 2;
        if (average > (value.rows + value.columns) / 2) {
            output = value;
        }
    });
    return output;
}
function shuffle(array) {
    var _a;
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = [
            array[randomIndex], array[currentIndex]
        ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
    return array;
}
//# sourceMappingURL=MatchingScript.js.map