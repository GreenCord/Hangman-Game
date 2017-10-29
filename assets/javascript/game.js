console.log('Loaded js.');

// Initialize everything used for the game


// functions
function toggleThis(objID,state) {
	document.getElementById(objID).style.display = state;
};

// Word/Phrase list
var words = [
	"",
	"",
];

// Game object
var game = {
	word: "",
	wins: 0,
	losses: 0,
	phase: 'instructions'
};

var instructions = document.getElementById('instructions');


// debug
console.log(game.word);
console.log(game.wins);
console.log(game.losses);

// Start Game
document.onkeyup = function(event) {
	var userPressed = event.key
	if (game.phase === "instructions") {
		// Instructions are displaying, game has ended or not yet begun
		switch (userPressed.toLowerCase()) {
			case '1':
				console.log('User pressed 1');
				toggleThis('instructions','none');
				toggleThis('onTrail','block');
				game.phase = 'playing';
				break;
			case '2':
				console.log('User pressed 2');
				break;
			case '3':
				console.log('User pressed 3');
				break;
			default:
				console.log('User pressed something else');
		};
	} else if (game.phase === "playing") {
		console.log(userPressed.toLowerCase());
		// Game is underway
	} else {
		alert('Something is wrong.')
	}
} 


// Select word/phrase to use for game

// Display blanks for word

// Collect user input

// Check if user input is in word/phrase

// If it is, display

// If not, draw hangman part

// If word/phrase fully guessed, record win

// If hangman fully drawn, record loss