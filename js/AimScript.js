const targetsArray = [];

// file size: 11.9 KB (12,259 bytes)
//TODO - hide the score tab on mobile, pause button and sounds when shooting.

//User interface objects.
const gamePlain = document.getElementById('Plain');
const scoreTab = document.getElementById('scoretab');
const UserTab = document.getElementById('UserTab');
const resultsTab = document.getElementById('results_tab');

//Score tab objects.
const totalShoots = document.getElementById('TotalShoots');
const missShoots = document.getElementById('MissShoots');
const gameAccuracy = document.getElementById('Accuracy');
const gameScore = document.getElementById('Score');

//Results tab objects.
const totalShoots_Result = document.getElementById('TotalShoots_result');
const missShoots_Result = document.getElementById('MissShoots_result');
const gameAccuracy_Result = document.getElementById('Accuracy_result');
const gameScore_Result = document.getElementById('Score_result');


//Create a target that will work as a showcase for the size of all the targets.
const targetShowcase = CreaterTarget(10);
document.getElementById('TargetContainer').appendChild(targetShowcase);
targetShowcase.style.position = 'relative';

//Every time the value of TargetSize changes we modify the size of the showcase.
document.getElementById('TargetSize').addEventListener('change', () => { TargetShowcaseSize(); });
document.getElementById('TargetSize').addEventListener('input', () => { TargetShowcaseSize(); });

function TargetShowcaseSize() {
	const targetSize = document.getElementById('TargetSize');
	let size = parseInt(targetSize.value);

	targetShowcase.style.width = `${size}vh`;
	targetShowcase.style.height = `${size}vh`;
}

//Hide results tab when close results button is clicked.
document.getElementById('close_results').onclick = (event) => { 
	event.target.parentElement.style.display = 'none';
}

function FocusTimer(timer) {
	let timeString = ''; // The current time input value as a string
	let keyDownController = new AbortController(); // AbortController to cancel the keydown event listener
  
	const updateTimer = () => {
	  // Update the timer element with the current time value
	  const digits = timeString.split('').reverse();
	  const ss = digits.slice(0, 2).reverse().join('').padStart(2, '0');
	  const mm = digits.slice(2, 4).reverse().join('').padStart(2, '0');
	  const hh = digits.slice(4, 6).reverse().join('').padStart(2, '0');
	  timer.innerHTML = `${hh}:${mm}:${ss}`;
	};
  
	const handleKeyDown = (event) => {
	  // Handle keydown events to update the time input value
	  const key = event.key;
	  if (key === 'Backspace') {
		timeString = timeString.slice(0, -1);
	  } else if (!key.startsWith('F') && /[0-9]/.test(key) && timeString.length < 6) {
		timeString += key;
	  }
	  updateTimer();
	};
  
	const handleMouseDown = () => {
	  // Handle mousedown events to remove the focus behavior from the timer element
	  keyDownController.abort();
	  timer.style.boxShadow = 'none';
	  document.removeEventListener('keydown', handleKeyDown);
	  document.removeEventListener('mousedown', handleMouseDown);
	};
  
	timer.addEventListener('mousedown', (event) => {
	  // Add the focus behavior to the timer element on mousedown events
	  event.stopPropagation();
	  keyDownController = new AbortController();
	  timer.style.boxShadow = '0px 0px 30px 5px var(--secondary)';
	  timeString = '';
	  updateTimer();
	  document.addEventListener('keydown', handleKeyDown, {
		signal: keyDownController.signal
	  });
	  document.addEventListener('mousedown', handleMouseDown);
	});
}
  
function StartGameAnimation() {
	const container = document.getElementById('gameContainer');

	container.className = 'game-container start-game-animation';

	return new Promise(resolve => {
		setTimeout(() => {
			resolve('resolved');
		}, 750);
	});
}

function EndGameAnimation() {
	const container = document.getElementById('gameContainer');

	return new Promise(resolve => {
		setTimeout(() => {
			container.className = 'game-container';
			resolve('resolved'); 
		}, 750);
	});
}

let scoreTabTimerId = 0;

async function StartGame() {
	const amountOfTargets = parseInt(document.getElementById('TargetAmount').value);

	if (amountOfTargets <= 0 || amountOfTargets > 20) {
		document.getElementById('TargetAmount').value = 20;
		return;
	}

	await StartGameAnimation();

	ToggleUserInterface(true);

	let totalTime = GetTimeFromUserTabTimer();

	if (totalTime > 0) {
		SetScoreTabTimer(totalTime);
	}

	SetTargetsInGame(amountOfTargets, gamePlain);

	gamePlain.addEventListener('mousedown', Shoot);
	await EndGameAnimation();

	function GetTimeFromUserTabTimer() {
		const timerDigits = document.getElementById('user-tab-timer').innerHTML.split(':');

		let ss = timerDigits[2];
		let mm = timerDigits[1];
		let hh = timerDigits[0];

		let totalTime = 0;
		if (ss.length !== 0) totalTime += parseInt(ss);
		if (mm.length !== 0) totalTime += parseInt(mm) * 60;
		if (hh.length !== 0) totalTime += parseInt(hh) * 3600;

		return totalTime;
	}

	function SetScoreTabTimer(totalTime) {
		const scoreTabTimer = document.getElementById('score-tab-timer');
		//Display timer as it is hidden by default.
		scoreTabTimer.style.display = 'block';
		//Set the initial time from the timer in user-tab.
		scoreTabTimer.innerHTML = document.getElementById('user-tab-timer').innerHTML;

		scoreTabTimerId = setInterval(() => {
			totalTime--;

			//Convert totalTime wich is in seconds to seconds, minutes and hours units.
			let ss = Math.floor(totalTime % 60).toString().padStart(2, '0');
			let mm = Math.floor((totalTime / 60) % 60).toString().padStart(2, '0');
			let hh = Math.floor((totalTime / 3600) % 100).toString().padStart(2, '0');

			scoreTabTimer.innerHTML = `${hh}:${mm}:${ss}`;

			if (totalTime <= 0) {
				clearInterval(scoreTabTimerId);
				EndGame();	
			}
		}, 1000)
	}
}

function SetTargetsInGame(amountOfTargets, plain) {
	const targetSize = parseInt(document.getElementById('TargetSize').value);
	const bounceMode = document.getElementById('BounceBool').checked;
	const randomMovementMode = document.getElementById('RandomBool').checked;

	for (var i = 0; i < amountOfTargets; i++) {
		const newTarget = CreaterTarget(targetSize);
		//Add an event to the path child of the svg (target),
		newTarget.firstChild.addEventListener('mousedown', (event) => {
			event.stopPropagation();
			ShootLand(newTarget);
		});
		
		plain.appendChild(newTarget);

		newTarget.ResetPosition = function() {
			ResetTargetPosition(newTarget, plain);
		};

		newTarget.ResetPosition();

		if (bounceMode || randomMovementMode) {
			//SetGameModes sets the bounce mode by default,
			//random movement mode is just an extension of the bounce mode.
			SetGameModes(newTarget, plain, randomMovementMode);
		}

		targetsArray.push(newTarget);
	}
}

function SetGameModes(target, plain, randomMovementMode = false) {
	//Set the original speed to the target object.
	target.speed = parseInt(document.getElementById('TargetSpeed').value);

	//Set dx and dy fields to the target object.
	RandomizeTargetDirection(target);

	SetBounceMode(target, plain);

	if (randomMovementMode) {
		SetRandomMovementMode(target);
	}

	function SetBounceMode(target, plain) {
		target.bounceIntervalId = setInterval(function () {
			//Modify target position by their direction.
			let x = parseInt(target.style.left);
			target.style.left = `${x += target.dx}px`;
	
			let y = parseInt(target.style.top);
			target.style.top = `${y += target.dy}px`;
	
			if (x >= (plain.offsetWidth - target.clientWidth)) {
				target.dx = -target.speed;
			}
			else if (x <= 0) {
				target.dx = target.speed;
			}
	
			if (y >= (plain.offsetHeight - target.clientHeight)) {
				target.dy = -target.speed;
			}
			else if (y <= 0) {
				target.dy = target.speed;
			}
		}, 20);
	}

	function SetRandomMovementMode(target) {
		target.randomizeIntervalId = setInterval(function () {
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					target.dx = 0;
					break;
				case 1:
					target.dx = target.speed;
					break;
				case 2:
					target.dx = -target.speed;
					break;
			}

			switch (Math.floor(Math.random() * 3)) {
				case 0:
					target.dy = 0;
					break;
				case 1:
					target.dy = target.speed;
					break;
				case 2:
					target.dy = -target.speed;
					break;
			}
		}, 500);
	}
}

function ResetTargetPosition(target, plain) {
	//Give a random position base on the game plain.
	target.style.left = `${ Math.floor(Math.random() * (plain.offsetWidth - target.clientWidth)) }px`;
	target.style.top = `${ Math.floor(Math.random() * (plain.offsetHeight - target.clientHeight)) }px`;
	
	if (Number.isNaN(target.bounceIntervalId) && !Number.isNaN(target.randomizeIntervalId)) {
		RandomizeTargetDirection(target);
	}
}

function RandomizeTargetDirection(target) {
	//Give an initial direction (dx, dy) to the target.
	switch (Math.floor(Math.random() * 3)) {
		case 0:
			target.dx = 0;
			break;
		case 1:
			target.dx = target.speed;
			break;
		case 2:
			target.dx = -target.speed;
			break;
	}

	switch (Math.floor(Math.random() * 3)) {
		case 0:
			target.dy = 0;
			break;
		case 1:
			target.dy = target.speed;
			break;
		case 2:
			target.dy = -target.speed;
			break;
	}

	//If both directions are equal to zero, change the value of one.
	if (target.dx === 0 && target.dy === 0) {
		if (Math.floor(Math.random() * 2) === 1) {
			target.dx = Math.floor(Math.random() * 2) ? target.speed : -target.speed;
		}
		else {
			target.dy = Math.floor(Math.random() * 2) ? target.speed : -target.speed;
		}
	}
}

async function EndGame() {
	await StartGameAnimation();

	clearInterval(scoreTabTimerId);

	ToggleUserInterface(false);

	gamePlain.removeEventListener('mousedown', Shoot);

	//Remove all targets and their intervals.
	targetsArray.forEach(function (target) {
		clearInterval(target.randomizeIntervalId);
		clearInterval(target.bounceIntervalId);
		target.remove();
	});

	targetsArray.splice(0, targetsArray.length);

	await EndGameAnimation();
}

function ToggleUserInterface(show) {
	resultsTab.style.display = show ? 'none' : 'block';
	scoreTab.style.display = show ? 'flex' : 'none';
	UserTab.style.display = show ? 'none': 'block';

	if (!show) 
	SetResultsTab();
}

function SetResultsTab() {
	//Put the score tab object's values in the results tab objects.
	totalShoots_Result.innerHTML = totalShoots.innerHTML;
	missShoots_Result.innerHTML = missShoots.innerHTML;
	gameAccuracy_Result.innerHTML = gameAccuracy.innerHTML;
	gameScore_Result.innerHTML = gameScore.innerHTML;

	//Reset their values.
	totalShoots.innerHTML = 0;
	missShoots.innerHTML = 0;
	gameAccuracy.innerHTML = '0%';
	gameScore.innerHTML = 0;
}

function Shoot() {
	let currentShoots = parseInt(totalShoots.innerHTML);
	currentShoots++;
	totalShoots.innerHTML = currentShoots;

	AccuracyCalculation();
	MissShoots();
}

function ShootLand(target) {
	let currentScore = parseInt(gameScore.innerHTML);
	// currentScore++;
	gameScore.innerHTML = ++currentScore;

	let currentShoots = parseInt(totalShoots.innerHTML);
	// currentShoots++;
	totalShoots.innerHTML = ++currentShoots;

	AccuracyCalculation();
	target.ResetPosition();
}

function MissShoots() {
	let currentShoots = parseInt(totalShoots.innerHTML);
	let currentScore = parseInt(gameScore.innerHTML);

	missShoots.innerHTML = currentShoots - currentScore;
}

function AccuracyCalculation() {
	let currentShoots = parseInt(totalShoots.innerHTML);
	let currentScore = parseInt(gameScore.innerHTML);

	if (currentShoots === 0) {
		return;
	}

	let acc = (currentScore / currentShoots) * 100;
	acc = Math.round(acc * 100) / 100;

	gameAccuracy.innerHTML = acc + "%";
}

function CreaterTarget(size) {
	const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	target.classList.add('target');
	target.setAttribute('viewBox', '0 0 14 14');
	target.style.height = `${size}vh`;
	target.style.width = `${size}vh`;

	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	//path is 14 x 14 circle
	path.setAttribute('d', 'M 0 5 L 0 9 L 1 9 L 1 11 L 2 11 L 2 12 L 3 12 L 3 13 L 5 13 L 5 14 L 9 14 L 9 13 L 11 13 L 11 12 L 12 12 L 12 11 L 13 11 L 13 9 L 14 9 L 14 5 L 13 5 L 13 3 L 12 3 L 12 2 L 11 2 L 11 1 L 9 1 L 9 0 L 5 0 L 5 1 L 3 1 L 3 2 L 2 2 L 2 3 L 1 3 L 1 5 L 0 5');
	target.appendChild(path);

	return target;
}