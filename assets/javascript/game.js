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
	child4: { name : "Winifred", gender : "female", alive: true }
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
	var items = ul.getElementsByTagName('li');
	for (var i = 0; i < items.length; i++) {
		items[i].innerHTML = arrFamily[i]['name'];
		arrFamily[i]['alive'] = true;
		items[i].classList.remove("dead");
		items[i].classList.add("alive");
		items[i].classList.add(arrFamily[i]['gender']);
	}
}

function updateUserInput(objID,key) {
	document.getElementById(objID).innerText = key;
}

// Word/Phrase list



// Start Game
initializeFamily('setupFamily');
initializeFamily('familyList');


document.onkeyup = function(event) {
	var userPressed = event.key

	if (game.phase === "instructions") {
		// Instructions are displaying, game has ended or not yet begun
		switch (userPressed.toLowerCase()) {
			
			// user chooses to play game
			case '1':
				console.log('User pressed 1');
				toggleThis('instructions','none');
				toggleThis('onTrail','block');
				game.phase = 'playing';
				// initialize word and begin play
				
				// Select word/phrase to use for game
				var gameWord = words[Math.floor(Math.random()*words.length)];
				console.log('The password is... ' + gameWord);
				
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
					console.log(wordArr[i])
				}
				ul.innerHTML = items;
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

	} else if (game.phase === "setup") {
		// user is in setup phase
		switch (userPressed.toLowerCase()){
			default:
				toggleThis('setup','none');
				toggleThis('instructions','block');
				game.phase = 'instructions';
				break;
		};
		// end user detection for setup phase

	} else if (game.phase === "playing") {
		// user is in play mode
		console.log(game.phase + ': ' + userPressed.toLowerCase());
				
		// Collect user input
		switch (userPressed.toLowerCase()) {
			default:
				//updateUserInput('userInput',userPressed);
				toggleThis('onTrail','none');
				toggleThis('instructions', 'block');
				game.phase = 'instructions';
				break;
		}
		// Check if user input is in word/phrase

		// If it is, display

		// If not, draw hangman part

		// If word/phrase fully guessed, record win

		// If hangman fully drawn, record loss

		// end user detection for game mode

	} else if (game.phase === "stats") {
		// user is in stats mode
		console.log(userPressed.toLowerCase());
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


