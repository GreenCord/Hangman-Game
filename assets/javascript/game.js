// Initialize everything used for the game

var game = {
	word: "",
	wordArr: [],
	lettersGuessedCorrectly: 0,
	guessedArr: [],
	wins: 0,
	losses: 0,
	phase: 'instructions',
	player: { name : "Wilbur", gender : "male", alive: true },
	spouse: { name : "Mabel", gender : "female", alive: true },
	child1: { name : "Walter", gender : "male", alive: true },
	child2: { name : "Eunice", gender : "female", alive: true },
	child3: { name : "Enos", gender : "male", alive: true },
	child4: { name : "Winifred", gender : "female", alive: true },
	lives: 5,
	letterding: new Audio('./assets/sounds/ding.wav'),
	familydeath: new Audio('./assets/sounds/dead.wav'),
	loss: new Audio('./assets/sounds/loss.wav'),
	win: new Audio('./assets/sounds/win.wav'),
	words: ['dysentery', 'snakebite', 'hunting',
			'river','goldrush','wagon',
			'buffalo','measles','exhaustion',
			'typhoid','cholera'],
	updateUserInput: function(objID,key) {
		document.getElementById(objID).innerText = key;
		},
	toggle: function(hideID,showID,gamePhase,gameStatus) 
		{
			document.getElementById(hideID).style.display = 'none';
			document.getElementById(showID).style.display = 'block';
			this.phase = gamePhase;
			if (gameStatus != undefined) {
				game.updateUserInput('gamestatus',gameStatus);
			}
		},
	killFamily: function(index)
		{
			var ul = document.getElementById('familyList');
			var items = ul.getElementsByTagName('li');
			items[index].classList.remove("alive");
			items[index].classList.add("dead");
		}
};

// initializing family

var arrFamily = [game.player, game.spouse, game.child1, game.child2, game.child3, game.child4];

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
};

// Start Game
initializeFamily('setupFamily');


document.onkeyup = function(event) {		// Detect user input based on game phase
	var userPressed = event.key

	if (game.phase === "instructions") {	// Instructions are displaying

		switch (userPressed.toLowerCase()) {														// user chooses to play game
			case '1':
				
				// initialize and begin play
				initializeFamily('familyList');
				game.lives = 5;
				game.lettersGuessedCorrectly = 0;
				game.guessedArr = [];
				game.updateUserInput('userInput','Letters guessed: ');

				// Select word/phrase to use for game
				var gameWord = game.words[Math.floor(Math.random()*game.words.length)];
				
				// Display blanks for word
				game.wordArr = gameWord.split(''); // put each letter into an array
				liWidth = 100 / game.wordArr.length; // create <li>s in ul#wordDisplay, update <li>s widths
				var ul = document.getElementById('wordDisplay');
				var items = [];
				for (var i = 0; i < game.wordArr.length; i++) {
					items += '<li style="width: ' + liWidth + ';">&mdash;</li>'
				}
				ul.innerHTML = items;
				game.toggle('instructions','onTrail','playing'); // change to onTrail panel to begin play
				break;
			
																																		
			case '2': 																										// user chooses to setup family
				game.toggle('instructions','setup','setup'); // change to setup panel
				break;
			
																																		// user chooses to view stats
			case '3':
				var _winCount = document.getElementById('winCount');
				var _lossCount = document.getElementById('lossCount');

				if (game.wins === 1) {   // updates stats panel with win/loss counters
					_winCount.innerText = game.wins + " time";
				} else {
					_winCount.innerText = game.wins + " times";
				}
				if (game.losses === 1) {
					_lossCount.innerText = game.losses + " time";
				} else {
					_lossCount.innerText = game.losses + " times";
				}

				game.toggle('instructions','stats','stats');
				break;
			
																																		// user chooses to quit
			case '4':
				game.toggle('instructions','gameOver','gameover');

																																		// user chooses something else
			default:
				// console.log('User pressed something else');
		};
		// end user detection for instructions panel

	} else if (game.phase === "setup") {															// user is in setup phase
		switch (userPressed.toLowerCase()){
			default:
				game.toggle('setup','instructions','instructions');
				break;
		};
		// end user detection for setup phase

	} else if (game.phase === "playing") { 														// user is in play mode
		
		// Collect user input
		var currentLetter = userPressed.toLowerCase();

		// loop through wordArr and count/display matches, record guessed letters
		var matchCount = 0;
		var a = game.guessedArr.indexOf(currentLetter);
		game.wordArr.forEach(function(letter){ // for each item in the array, check if it matches guessed letter
			if (currentLetter === letter) { // if it matches
				matchCount++;									// add 1 to match count
			}
		});
				
		if (matchCount > 0) { // if match count is 1 or more, then display the matched letters in the word
			// display letters
			var ul = document.getElementById('wordDisplay');
			var items = ul.getElementsByTagName('li');
			if (a < 0) {
				for (var i = 0; i < game.wordArr.length; i++) {
					if (game.wordArr[i] === currentLetter) {
						items[i].innerText = currentLetter.toUpperCase();
						game.lettersGuessedCorrectly++;
						if (a < 0) {	// if guessed letter is not in the array
							game.guessedArr.push(currentLetter); // add the letter to the array
							a = game.guessedArr.indexOf(currentLetter);
							document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' '; //add to visible letters guessed
							game.letterding.play(); //play letter ding sound
						}
					}
				}
			}
			if (game.wordArr.length === game.lettersGuessedCorrectly) { // Detect win condition - when letters guessed equals the length of the word
				game.win.play();
				game.wins++;
				game.toggle('onTrail','instructions','instructions','You made it to Oregon! Hooray.');
			}

		} else {
			if (a < 0) {
				game.guessedArr.push(currentLetter);
				document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' ';
				// kill family member
				game.killFamily(game.lives);
				game.lives--;
				if (game.lives < 0) { // No more family members, user loses
					game.loss.play();
					game.losses++;
					game.toggle('onTrail','instructions','instructions','You didn\'t make it to Oregon.');
				} else if (game.lives >= 0) { // Still family members left
					game.familydeath.play();
				}
			}
		}

		// end user detection for game mode

	} else if (game.phase === "stats") {															// user is in stats mode
		// user is in stats mode
		
		// Collect user input
		switch (userPressed.toLowerCase()) {
			default:
				game.toggle('stats','instructions','instructions');
				break;
		}
	} 

} // end detects user keypress