// Initialize everything used for the game
var words = [
	"dysentery",
	"snakebite",
	"hunting",
	"river",
	"goldrush",
	"wagon",
	"buffalo",
	"measles",
	"exhaustion",
	"typhoid",
	"cholera"
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

// functions
function toggleThis(objID,state) {
	document.getElementById(objID).style.display = state;
};

function initializeFamily(listId) {
	var ul = document.getElementById(listId);
	var famitems = ul.getElementsByTagName('li');
	for (var i = 0; i < famitems.length; i++) {
		famitems[i].innerHTML = arrFamily[i]['name'];
		arrFamily[i]['alive'] = true;
		famitems[i].classList.remove("dead");
		famitems[i].classList.add("alive");
		famitems[i].classList.add(arrFamily[i]['gender']);
	}
}

function killFamily(index) {
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
				
				// Display blanks for word
				// put each letter into an array
				wordArr = gameWord.split('');
			
				
				// create <li>s in ul#wordDisplay
				// update <li>s widths
				liWidth = 100 / wordArr.length;
				var ul = document.getElementById('wordDisplay');
				var items = [];
				for (var i = 0; i < wordArr.length; i++) {
					items += '<li style="width: ' + liWidth + ';">&mdash;</li>'
				}
				ul.innerHTML = items;
				toggleThis('instructions','none');
				toggleThis('onTrail','block');
				game.phase = 'playing';
				break;
			
																																		// user choose to setup family
			case '2':
				toggleThis('instructions','none');
				toggleThis('setup','block')
				game.phase = 'setup';
				break;
			
																																		// user chooses to view stats
			case '3':
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
				toggleThis('instructions','none');
				toggleThis('gameOver','block');
				game.phase = 'gameover';

																																		// user chooses something else
			default:
				// console.log('User pressed something else');
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

		// loop through wordArr and count/display matches, record guessed letters
		var matchCount = 0;
		var a = guessedArr.indexOf(currentLetter);
		wordArr.forEach(function(letter){ // for each item in the array, check if it matches guessed letter
			if (currentLetter === letter) { // if it matches
				matchCount++;									// add 1 to match count
			}
		});
				
		if (matchCount > 0) { // if match count is 1 or more, then display the matched letters in the word
			// display letters
			var ul = document.getElementById('wordDisplay');
			var items = ul.getElementsByTagName('li');
			if (a < 0) {
				for (var i = 0; i < wordArr.length; i++) {
					if (wordArr[i] === currentLetter) {
						items[i].innerText = currentLetter.toUpperCase();
						lettersGuessedCount++;
						if (a < 0) {	// if guessed letter is not in the array
							guessedArr.push(currentLetter); // add the letter to the array
							a = guessedArr.indexOf(currentLetter);
							document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' '; //add to visible letters guessed
							game.letterding.play(); //play letter ding sound
						}
					}
				}
			}
			if (wordArr.length === lettersGuessedCount) { // Detect win condition - when letters guessed equals the length of the word
				game.win.play();
				game.wins++;
				//document.getElementById('gamestatus').innerText = "You made it to Oregon! Hooray."
				updateUserInput('gamestatus','You made it to Oregon! Hooray.');
				toggleThis('instructions','block');
			  toggleThis('onTrail','none');
				game.phase = 'instructions';
			}

		} else {
			if (a < 0) {
				guessedArr.push(currentLetter);
				document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' ';
				// kill family member
				killFamily(lives);
				lives--;
				if (lives < 0) {
					game.loss.play();
					//document.getElementById('gamestatus').innerText = "Your family died of dysentery."
					updateUserInput('gamestatus','You didn\'t make it to Oregon.');
					game.losses++;
					toggleThis('instructions','block');
			  	toggleThis('onTrail','none');
					game.phase = 'instructions';
				} else if (lives >= 0) {
					game.familydeath.play();
				}
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


