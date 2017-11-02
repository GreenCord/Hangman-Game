// Initialize everything used for the game

var game = {
	word: "",
	wordArr: [],
	lettersGuessedCorrectly: 0,
	guessedArr: [],
	wins: 0,
	losses: 0,
	phase: 'instructions',
	player: { name : "Wilbur", alive: true },
	spouse: { name : "Mabel",  alive: true },
	child1: { name : "Walter", alive: true },
	child2: { name : "Eunice", alive: true },
	child3: { name : "Enos", alive: true },
	child4: { name : "Winifred", alive: true },
	lives: 5,
	deathReason: ['broken arm','broken leg', 'exhaustion', 'cholera', 'typhoid', 'snakebite', 'fever', 'drowning', 'measles', 'dysentery'],
	wagonImage: [
		'<img src="./assets/img/wagon_default.gif" alt="Wagon" />'
	],
	eventImage: [
		['<img src="./assets/img/event_river.gif" alt="River" />', 'You reached a river. Guess a letter correctly to cross.'],
		['<img src="./assets/img/event_forest.gif" alt="Forest" />', 'You arrive at a forest. Guess a letter to hunt for food.'],
		['<img src="./assets/img/event_fort.gif" alt="Fort" />', 'You happen upon a fort. Guess a letter to resupply!']
	],
	letterding: new Audio('./assets/sounds/ding.wav'),
	familydeath: new Audio('./assets/sounds/dead.wav'),
	loss: new Audio('./assets/sounds/loss.wav'),
	win: new Audio('./assets/sounds/win.wav'),
	words: [
			'dysentery', 'snakebite', 'hunting',
			'river','goldrush','wagon',
			'buffalo','measles','exhaustion',
			'typhoid','cholera', 'exploration',
			'cavalry', 'mountains', 'funeral',
			'pioneer', 'independence', 'yukon'
			],
	updateUserInput: function(objID,key,html)
		{
			if (html) {
				document.getElementById(objID).innerHTML = key;
			} else {
				document.getElementById(objID).innerText = key;
			}
		},
	updateName: function(objID,key)
		{
			var person = document.getElementsByClassName(objID);
			var newName = prompt(key);
			Array.prototype.forEach.call(person, function(element) {
				element.innerText = newName;
			});
			game[objID]['name'] = newName;
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
			var famName = items[index].innerText;
			var death = game.deathReason[Math.floor(Math.random()*game.deathReason.length)];
			items[index].classList.remove("alive");
			items[index].classList.add("dead");
			game.updateUserInput('trailText',famName + ' has died of ' + death + '.');
			// document.getElementById('trailText').innerText = famName + ' has died of ' + death + '.';
		},
		randomizeEvent: function(eventID,eventTxt)
			{
				
				var randomized = game[eventID][Math.floor(Math.random()*game[eventID].length)];
				if (!eventTxt) {
					// is array
					game.updateUserInput(eventID,randomized,true);
				} else {
					game.updateUserInput(eventID,randomized[0],true);
					game.updateUserInput('trailText',randomized[1]);
				}
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
	}
};

function initializeGame() {
	// initialize and begin play
	restrictChars = /^[a-zA-Z]+$/;
	initializeFamily('familyList');
	game.lives = 5;
	game.lettersGuessedCorrectly = 0;
	game.guessedArr = [];
	game.updateUserInput('userInput','Letters guessed: ');

	// choose first random event
	game.randomizeEvent('wagonImage',false);
	game.randomizeEvent('eventImage',true);
	// Select word/phrase to use for game
	gameWord = game.words[Math.floor(Math.random()*game.words.length)];
	
	// Display blanks for word
	game.wordArr = gameWord.split(''); // put each letter into an array
	liWidth = 100 / game.wordArr.length; // create <li>s in ul#wordDisplay, update <li>s widths
	var ul = document.getElementById('wordDisplay');
	var items = [];
	for (var i = 0; i < game.wordArr.length; i++) {
		items += '<li style="width: ' + liWidth + '%;">&mdash;</li>'
	}
	ul.innerHTML = items;
	game.toggle('instructions','onTrail','playing'); // change to onTrail panel to begin play
};

// Start Game
initializeFamily('setupFamily');


document.onkeypress = function(event) {		// Detect user input based on game phase
	var userPressed = event.key;
	var restrictChars = /^[a-zA-Z]+$/;
	var gameWord = '';
	
	if (game.phase === "instructions") {	// Instructions are displaying

		switch (userPressed.toLowerCase()) {														// user chooses to play game
			case '1':
				
				// initialize and begin play
				initializeGame();
				game.toggle('instructions','onTrail','playing'); // change to onTrail panel to begin play
				break;
			
																																		
			case '2':// user chooses to setup family
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
			case '1':
				game.updateName('player','What is your name?');
				break;
			case '2':
				game.updateName('spouse','What is your spouse\'s name?');
				break;
			case '3':
				game.updateName('child1','What is your first child\'s name?');
				break;
			case '4':
				game.updateName('child2','What is your second child\'s name?');
				break;
			case '5':
				game.updateName('child3','What is your third child\'s name?');
				break;
			case '6':
				game.updateName('child4','What is your fourth child\'s name?');
				break;
			default:
				game.toggle('setup','instructions','instructions');
				break;
		};
		// end user detection for setup phase

	} else if (game.phase === "playing") { 														// user is in play mode
		
		// Collect user input
		
		if (restrictChars.test(userPressed)) {
			var currentLetter = userPressed.toLowerCase();
		} else {
			var currentLetter = '';
		}

		// loop through wordArr and count/display matches, record guessed letters
		var matchCount = 0;
		var a = game.guessedArr.indexOf(currentLetter);
		game.wordArr.forEach(function(letter){ // for each item in the array, check if it matches guessed letter
			if (currentLetter === letter) { // if it matches
				matchCount++;// add 1 to match count
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
							game.randomizeEvent('wagonImage',false);
							game.randomizeEvent('eventImage',true);
						}
					}
				}
			}
			if (game.wordArr.length === game.lettersGuessedCorrectly) { // Detect win condition - when letters guessed equals the length of the word
				game.win.play();
				game.wins++;

				//##todo## Update event and wagon image to victory conditions

				game.updateUserInput('trailText','Congratulations! You made it to Oregon! Play again? (Y/N)');
				game.toggle('instructions','onTrail','replay','');
			}

		} else {
			if ((a < 0) && (currentLetter != '')) {
				game.guessedArr.push(currentLetter);
				document.getElementById('userInput').innerText += currentLetter.toUpperCase() + ' ';
				// kill family member
				game.killFamily(game.lives);
				game.lives--;
				if (game.lives < 0) { // No more family members, user loses
					game.loss.play();
					game.losses++;
					
					//##todo## update event and wagon image to loss conditions
					
					game.updateUserInput('trailText','Your entire family is dead. Play again? (Y/N)');
					game.toggle('instructions','onTrail','replay','');

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
	} else if (game.phase === 'replay') {
		restrictChars = /^[yn]+$/;
		if (restrictChars.test(userPressed)) {
			var currentLetter = userPressed.toLowerCase();
		} else {
			var currentLetter = '';
		}
		switch(currentLetter) {
			case 'y':
				game.toggle('instructions','onTrail','playing','');
				initializeGame();
				break;
			case 'n':
				game.toggle('onTrail','instructions','instructions','Choose from an option below.');
				break;
		}
	}

} // end detects user keypress