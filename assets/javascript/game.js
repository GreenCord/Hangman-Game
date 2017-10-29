console.log('Loaded js.');

// Initialize everything used for the game
var words = [
	"dysentery",
	"snakebite",
	"hunting"
];

var wordArr = [];

var game = {
	word: "",
	wins: 0,
	losses: 0,
	phase: 'instructions',
	player: { name : "Wilbur", gender : "male", alive: true },
	spouse: { name : "Mabel", gender : "female", alive: true },
	child1: { name : "Walter", gender : "male", alive: true },
	child2: { name : "Eunice", gender : "female", alive: true },
	child3: { name : "Enos", gender : "male", alive: true },
	child4: { name : "Winifred", gender : "female", alive: true },
	letterding: new Audio('./assets/sounds/ding.wav'),
	familydeath: new Audio('./assets/sounds/dead.wav'),
	loss: new Audio('./assets/sounds/loss.wav'),
	win: new Audio('./assets/sounds/win.wav')
};

var arrFamily = [game.player, game.spouse, game.child1, game.child2, game.child3, game.child4]

// for (var i = 0; i < arrFamily.length; i++) {
// 	console.log(arrFamily[i]);
// 	console.log(arrFamily[i]['name']);
// }
// functions
function toggleThis(objID,state) {
	document.getElementById(objID).style.display = state;
};

function initializeFamily(listId) {
	var ul = document.getElementById(listId);
	var famitems = ul.getElementsByTagName('li');
	console.log(famitems);
	for (var i = 0; i < famitems.length; i++) {
		famitems[i].innerHTML = arrFamily[i]['name'];
		arrFamily[i]['alive'] = true;
		famitems[i].classList.remove("dead");
		famitems[i].classList.add("alive");
		famitems[i].classList.add(arrFamily[i]['gender']);
	}
}

function killFamily(index) {
	console.log('KillFamily Index is ' + index + ".");
	var ul = document.getElementById('familyList');
	var items = ul.getElementsByTagName('li');
	items[index].classList.remove("alive");
	items[index].classList.add("dead");
}

function updateUserInput(objID,key) {
	document.getElementById(objID).innerText = key;
}

// Word/Phrase list



// Start Game
initializeFamily('setupFamily');
var lives = 5;
var lettersGuessedCount = 0;
var guessedArr = [];

document.onkeyup = function(event) {																// Detect user input based on game phase
	var userPressed = event.key

	if (game.phase === "instructions") {															// Instructions are displaying

		switch (userPressed.toLowerCase()) {														// user chooses to play game
			case '1':
				
				// initialize and begin play
				initializeFamily('familyList');
				lives = 5;
				lettersGuessedCount = 0;
				guessedArr = [];
				document.getElementById('userInput').innerText = "Letters guessed: ";
				// Select word/phrase to use for game
				var gameWord = words[Math.floor(Math.random()*words.length)];
				console.log('The password is... ' + gameWord);
				
				// Display blanks for word
				// put each letter into an array
				wordArr = gameWord.split('');
				console.log('WordArr is...' + wordArr);
				
				// create <li>s in ul#wordDisplay
				// update <li>s widths
				liWidth = 100 / wordArr.length;
				var ul = document.getElementById('wordDisplay');
				var items = [];
				for (var i = 0; i < wordArr.length; i++) {
					items += '<li style="width: ' + liWidth + ';">&mdash;</li>'
				}
				ul.innerHTML = items;
				console.log('User pressed 1');
				toggleThis('instructions','none');
				toggleThis('onTrail','block');
				game.phase = 'playing';
				break;
			
																																		// user choose to setup family
			case '2':
				console.log('User pressed 2');
				toggleThis('instructions','none');
				toggleThis('setup','block')
				game.phase = 'setup';
				break;
			
																																		// user chooses to view stats
			case '3':
				console.log('User pressed 3');
				if ((game.wins > 1) || (game.wins === 0)) {
					document.getElementById('winCount').innerText = game.wins + " times";
				} else {
					document.getElementById('winCount').innerText = game.wins + " time";
				}
				if ((game.losses > 1) || (game.losses === 0)) {
					document.getElementById('lossCount').innerText = game.losses + " times";
				} else {
					document.getElementById('lossCount').innerText = game.losses + " time";
				}
				toggleThis('instructions','none');
				toggleThis('stats','block')
				game.phase = 'stats';
				break;
			
																																		// user chooses to quit
			case '4':
				console.log('User pressed 4')
				toggleThis('instructions','none');
				toggleThis('gameOver','block');
				game.phase = 'gameover';

																																		// user chooses something else
			default:
				console.log('User pressed something else');
		};
		// end user detection for instructions panel

	} else if (game.phase === "setup") {															// user is in setup phase
		switch (userPressed.toLowerCase()){
			default:
				toggleThis('setup','none');
				toggleThis('instructions','block');
				game.phase = 'instructions';
				break;
		};
		// end user detection for setup phase

	} else if (game.phase === "playing") { 														// user is in play mode
		
		// Collect user input
		var currentLetter = userPressed.toLowerCase();
		/* debug */ console.log('Playing. User chose: ' + currentLetter);

		// loop through wordArr and count/display matches, record guessed letters
		var matchCount = 0;
		wordArr.forEach(function(letter){
			if (currentLetter === letter) {
				matchCount++;
				var a = guessedArr.indexOf(currentLetter);
				console.log ('Index of ' + currentLetter + "= " + a);
				if (a < 0) {	
					lettersGuessedCount++; 
					console.log('Adding to letters guessed count')
				}
			}
		});
		if (guessedArr.indexOf(currentLetter) < 0) { 
			guessedArr.push(currentLetter);
			document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' ';
		}
		console.log(guessedArr);
		
		if (matchCount > 0) {
			// display letters
			var ul = document.getElementById('wordDisplay');
			var items = ul.getElementsByTagName('li');
			for (var i = 0; i < wordArr.length; i++) {
				if (wordArr[i] === currentLetter) {
					items[i].innerText = currentLetter.toUpperCase();
					game.letterding.play();
				}
			}
			if (wordArr.length === lettersGuessedCount) { // Detect win condition - when letters guessed equals the length of the word
				game.win.play();
				game.wins++;
				document.getElementById('gamestatus').innerText = "You made it to Oregon! Hooray."
				toggleThis('instructions','block');
			  toggleThis('onTrail','none');
				game.phase = 'instructions';
			}

		} else {
			// kill family member
			killFamily(lives);
			console.log(lives);
			lives--;
			console.log('lost life: '+lives);
			if (lives < 0) {
				game.loss.play();
				document.getElementById('gamestatus').innerText = "Your family died of dysentery."
				game.losses++;
				toggleThis('instructions','block');
			  toggleThis('onTrail','none');
				game.phase = 'instructions';
			} else if (lives >= 0) {
				game.familydeath.play();
			}
		}

		// end user detection for game mode

	} else if (game.phase === "stats") {
		// user is in stats mode
		
		// Collect user input
		switch (userPressed.toLowerCase()) {
			default:
				//updateUserInput('userInput',userPressed);
				toggleThis('stats','none');
				toggleThis('instructions', 'block');
				game.phase = 'instructions';
				break;
		}
	} else {
		alert('Something is wrong.')
	}
} // end detects user keypress


