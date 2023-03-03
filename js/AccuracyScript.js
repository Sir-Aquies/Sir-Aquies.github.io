var amount = 1;
const targetsArray = [];

//there is no need for this class, it's just that i wrote the code while reading about javascript classes
//and now i don't want to rewrite it.
class Target {
	constructor(size, x, y) {
		this.target = CreaterTarget(size, false);
		this.target.style.left = `${x}px`;
		this.target.style.top = `${y}px`;
		this.target.addEventListener("mousedown", () => { ShootLand(this) });
	}

	ResetPosition() {
		const plain = document.getElementById("Plain");

		let target_x = Math.floor(Math.random() * (plain.offsetWidth - this.target.offsetWidth));
		let target_y = Math.floor(Math.random() * (plain.offsetHeight - this.target.offsetHeight));

		this.target.style.left = `${ target_x }px`;
		this.target.style.top = `${ target_y }px`;

		if (this.target.bounce && !this.target.randomize) {
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					this.target.dx = 0;
					break;
				case 1:
					this.target.dx = this.target.speed;
					break;
				case 2:
					this.target.dx = -this.target.speed;
					break;
			}

			switch (Math.floor(Math.random() * 3)) {
				case 0:
					this.target.dy = 0;
					break;
				case 1:
					this.target.dy = this.target.speed;
					break;
				case 2:
					this.target.dy = -this.target.speed;
					break;
			}

			//If both directions are equal to zero, change the value of one.
			if (this.target.dx === 0 && this.target.dy === 0) {
				if (Math.floor(Math.random() * 2) === 1) {
					this.target.dx = Math.floor(Math.random() * 2) ? this.target.speed : -this.target.speed;
				}
				else {
					this.target.dy = Math.floor(Math.random() * 2) ? this.target.speed : -this.target.speed;
				}
			}
		}
	}

	Resize(w, h) {
		this.target.style.width = `${w}vh`;
		this.target.style.height = `${h}vh`;
	}

	ReLocate(x, y) {
		this.target.style.left = `${x}px`;
		this.target.style.top = `${y}px`;
	}
}

//Create a target that will work as a showcase for the size of all the targets.
const targetShowcase = CreaterTarget(10, true);

//Every time the value of TargetSize changes we modify the size of the showcase.
document.getElementById("TargetSize").addEventListener("change", () => { TargetShowcaseSize(); });
document.getElementById("TargetSize").addEventListener("input", () => { TargetShowcaseSize(); });

document.getElementById('results_tab').addEventListener('click', () => { document.getElementById('results_tab').style.display = 'none'; });

document.getElementById('timer').addEventListener('click', function () {
	ClickTimer(this);
});

function ClickTimer(timer) {
	let text = '';
	let controller = new AbortController();

	timer.style.boxShadow = '0px 0px 30px 5px var(--secondary)';

	document.addEventListener('keydown', function (key) {
		if (key.key == 'Backspace') {
			if (text.length > 0) {
				text = text.slice(0, text.length - 1);
			}
		}
		else if (key.key.match(/[0-9]/g) && text.length < 6) {
			text += key.key;
		}

		const array = text.split('');
		array.reverse();

		let ss = '';
		let mm = '';
		let hh = '';

		for (let i = 0; i < array.length; i++) {
			if (i < 2) {
				ss += array[i];
			}

			if (i >= 2 && i <= 3) {
				mm += array[i];
			}

			if (i >= 4) {
				hh += array[i];
			}
		}

		ss = ss.split('').reverse().join('').padStart(2, '0');
		mm = mm.split('').reverse().join('').padStart(2, '0');
		hh = hh.split('').reverse().join('').padStart(2, '0');

		timer.innerHTML = `${hh}:${mm}:${ss}`;
	}, {signal: controller.signal});

	document.addEventListener('mousedown', UnfocusTimer)

	function UnfocusTimer() {
		controller.abort();
		timer.style.boxShadow = 'none';
		document.removeEventListener('mousedown', UnfocusTimer)
	}
}

function TargetShowcaseSize() {
	const targetSize = document.getElementById("TargetSize");
	let size = parseInt(targetSize.value);

	targetShowcase.style.width = `${size}vh`;
	targetShowcase.style.height = `${size}vh`;
}

document.getElementById("PlayButton").addEventListener("click", () => { StartGame() });

function StartAnimation() {
	const container = document.getElementById("gameContainer");

	container.className = "game-container transition-class";

	return new Promise(resolve => {
		setTimeout(() => {
			resolve('resolved');
		}, 500);
	});
}

function EndAnimation() {
	const container = document.getElementById("gameContainer");

	return new Promise(resolve => {
		setTimeout(() => {
			container.className = "game-container";
			resolve('resolved'); 
		}, 1000);
	});
}
let clearTimer = 0;

async function StartGame() {
	const amount = parseInt(document.getElementById("TargetAmount").value);

	if (amount <= 0 || amount > 20) {
		document.getElementById("TargetAmount").value = 20;
		return;
	}

	await StartAnimation();

	const targetSize = document.getElementById("TargetSize").value;
	const bounceBool = document.getElementById("BounceBool").checked;
	const randomBool = document.getElementById("RandomBool").checked;
	const plain = document.getElementById("Plain");

	document.getElementById('results_tab').style.display = 'none';
	document.getElementById("ResetBtn").style.display = "block";
	document.getElementById("scoretab").style.display = "flex";
	document.getElementById("UserTab").style.display = "none";

	let isTime = document.getElementById('timer').innerHTML.split(':');

	let ss = isTime[2];
	let mm = isTime[1];
	let hh = isTime[0];

	let totalTime = 0;
	if (ss.length !== 0) totalTime += parseInt(ss);
	if (mm.length !== 0) totalTime += parseInt(mm) * 60;
	if (hh.length !== 0) totalTime += parseInt(hh) * 3600;

	if (totalTime > 0) {
		const timer = document.getElementById('score-tab-timer');
		timer.style.display = 'block';
		timer.innerHTML = document.getElementById('timer').innerHTML;

		clearTimer = setInterval(() => {
			totalTime--;

			if (totalTime <= 0) {
				clearInterval(clearTimer);
				EndGame();
			}

			let seconds = totalTime;

			let ss = Math.floor(seconds % 60).toString().padStart(2, '0');

			let mm = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');

			let hh = Math.floor((seconds / 3600) % 100).toString().padStart(2, '0');

			timer.innerHTML = `${hh}:${mm}:${ss}`;
		}, 1000)
	}

	for (var i = 0; i < amount; i++) {
		var TargetClass = new Target(parseInt(targetSize));
		TargetClass.ResetPosition();

		if (bounceBool || randomBool) {
			const speed = parseInt(document.getElementById("TargetSpeed").value);

			const tgt = TargetClass.target;
			tgt.speed = speed;
			//Give a direction to the target, either 0, positive speed or negative speed.
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					tgt.dx = 0;
					break;
				case 1:
					tgt.dx = tgt.speed;
					break;
				case 2:
					tgt.dx = -tgt.speed;
					break;
			}

			switch (Math.floor(Math.random() * 3)) {
				case 0:
					tgt.dy = 0;
					break;
				case 1:
					tgt.dy = tgt.speed;
					break;
				case 2:
					tgt.dy = -tgt.speed;
					break;
			}

			//If both directions are equal to zero, change the value of one.
			if (tgt.dx === 0 && tgt.dy === 0) {
				if (Math.floor(Math.random() * 2) === 1) {
					tgt.dx = Math.floor(Math.random() * 2) ? tgt.speed : -tgt.speed;
				}
				else {
					tgt.dy = Math.floor(Math.random() * 2) ? tgt.speed : -tgt.speed;
				}
			}

			tgt.bounce = setInterval(function () {
				let x = parseInt(tgt.style.left);
				x += tgt.dx;
				tgt.style.left = `${x}px`;

				let y = parseInt(tgt.style.top);
				y += tgt.dy;
				tgt.style.top = `${y}px`;

				if (tgt.offsetLeft >= (plain.offsetWidth - tgt.clientWidth)) {
					tgt.dx = -tgt.speed;
				}
				else if (tgt.offsetLeft <= 0) {
					tgt.dx = tgt.speed;
				}

				if (tgt.offsetTop >= (plain.offsetHeight - tgt.clientHeight)) {
					tgt.dy = -tgt.speed;
				}
				else if (tgt.offsetTop <= 0) {
					tgt.dy = tgt.speed;
				}
			}, 20);

			if (randomBool) {
				tgt.randomize = setInterval(function () {
					switch (Math.floor(Math.random() * 3)) {
						case 0:
							tgt.dx = 0;
							break;
						case 1:
							tgt.dx = tgt.speed;
							break;
						case 2:
							tgt.dx = -tgt.speed;
							break;
					}

					switch (Math.floor(Math.random() * 3)) {
						case 0:
							tgt.dy = 0;
							break;
						case 1:
							tgt.dy = tgt.speed;
							break;
						case 2:
							tgt.dy = -tgt.speed;
							break;
					}
				}, 500);
			}
		}

		targetsArray.push(TargetClass);
	}

	plain.addEventListener("mousedown", Shoot);
	await EndAnimation();
}

function ResultsScreen() {
	document.getElementById('results_tab').style.display = 'block';

	const totalResult = document.getElementById('TotalShoots_result');
	const MissResult = document.getElementById('MissShoots_result');
	const AccuracyResult = document.getElementById('Accuracy_result');
	const ScoreResult = document.getElementById('Score_result');

	totalResult.innerHTML = document.getElementById("TotalShoots").innerHTML
	MissResult.innerHTML = document.getElementById("MissShoots").innerHTML
	AccuracyResult.innerHTML = document.getElementById("Accuracy").innerHTML
	ScoreResult.innerHTML = document.getElementById("Score").innerHTML
}

async function EndGame() {
	await StartAnimation();

	clearInterval(clearTimer);
	ResultsScreen();

	document.getElementById("TotalShoots").innerHTML = 0;
	document.getElementById("MissShoots").innerHTML = 0;
	document.getElementById("Accuracy").innerHTML = "0%";
	document.getElementById("ResetBtn").style.display = "none";
	document.getElementById("UserTab").style.display = "block";
	document.getElementById("scoretab").style.display = "none";
	document.getElementById("Score").innerHTML = 0;
	const plain = document.getElementById("Plain");

	amount = 0;

	targetsArray.forEach(function (value) {
		clearInterval(value.target.randomize);
		clearInterval(value.target.bounce);
		value.target.remove();
	});

	targetsArray.splice(0, targetsArray.length);

	plain.removeEventListener("mousedown", Shoot);

	await EndAnimation();
}

function Shoot() {
	const totalShoots = document.getElementById("TotalShoots");

	let currentShoots = parseInt(totalShoots.innerHTML);
	currentShoots++;
	totalShoots.innerHTML = currentShoots;

	AccuracyCalculation();
	MissShoots();
}

function ShootLand(CurrTarget) {
	event.stopPropagation();
	const totalShoots = document.getElementById("TotalShoots");
	const score = document.getElementById("Score");

	let currentScore = parseInt(score.innerHTML);
	currentScore++;
	score.innerHTML = currentScore;

	let currentShoots = parseInt(totalShoots.innerHTML);
	currentShoots++;
	totalShoots.innerHTML = currentShoots;

	AccuracyCalculation();
	CurrTarget.ResetPosition();
}

function MissShoots() {
	const score = document.getElementById("Score");
	const totalShoots = document.getElementById("TotalShoots");
	const missShoots = document.getElementById("MissShoots");

	let currentShoots = parseInt(totalShoots.innerHTML);
	let currentScore = parseInt(score.innerHTML);

	missShoots.innerHTML = currentShoots - currentScore;
}

function AccuracyCalculation() {
	const totalShoots = document.getElementById("TotalShoots");
	const accuracy = document.getElementById("Accuracy");
	const score = document.getElementById("Score");

	let currentShoots = parseInt(totalShoots.innerHTML);
	let currentScore = parseInt(score.innerHTML);

	if (currentShoots === 0) {
		return;
	}

	let acc = (currentScore / currentShoots) * 100;
	acc = Math.round(acc * 100) / 100;

	accuracy.innerHTML = acc + "%";
}

function CreaterTarget(size, show) {
	const targetdiv = document.createElement("div");

	targetdiv.className = 'target';
	targetdiv.style.height = `${size}vh`;
	targetdiv.style.width = `${size}vh`;
	targetdiv.id = `target_${amount}`;
	amount++;

	if (show == true) {
		document.getElementById("TargetContainer").appendChild(targetdiv);
		targetdiv.style.position = 'relative';
	}
	else {
		document.getElementById("Plain").appendChild(targetdiv);
	}

	return targetdiv;
}