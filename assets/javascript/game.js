/*
    JStu
    HW 3 Word Guessing Game JavaScript 2019
    UTexas PTF Coding Bootcamp
*/

var userGuess = document.getElementById("userGuess"); //TODO link to show past wrong guess
var userAnswer = document.getElementById("userAnswer"); //TODO link to show users right guesses
var userWins = document.getElementById("win"); 
var userLoss = document.getElementById("lose"); 
var userTries = document.getElementById("tries"); 
var instructions = document.getElementById("instructions");
var img = document.getElementById("picture");
var message = document.getElementById("message");
var inputField = document.getElementById("textInput");

//Object Class that holds the game core data
var gameCore = {
    
    winCount: 0,
    loseCount: 0,
    triesLeft: 10,
    wordList: ['SPOCK', 'ENTERPRISE', 'KLINGON', 'VULCAN', 'DEEP SPACE 9', 'FEDERATION', 'SCOTTY', 'BONES' , 'PICARD', 'CRUSHER'], //List of words for game
    imgList: ['Spock.jpg', 'enterprise.jpg', 'Klingon.jpg', 'vulcan.jpg', 'DS9.jpg', 'UFP.jpg', 'Scotty.jpg', 'Bones.jpg', 'Picard.jpg', 'Crusher.jpg'], //List image reference
    answers: "",
    imageSrc: "",
    displayWord: [], //Empty list to display word as '_' and to compare with answers
    wrongGuess: [], //Empty list to hold letters that the user guessed wrong
    rightGuess: [], //Empty list to hold letters that the user guessed right

    gameStart: false, //trigger flag for press anykey

    gameReset: function() {
        //Resets the guess list and number of tries
        this.triesLeft = 10;
        this.wrongGuess = [];
        this.rightGuess = [];
        this.displayWord = [];

        //randomly choose new word from list of game words
        var ranNum = Math.floor(Math.random() * this.wordList.length)
        this.answers = this.wordList[ranNum];
        this.imageSrc = this.imgList[ranNum];
        
        this.displayWordBlank();

        message.textContent = "Space: The Final Frontier...";
        userGuess.textContent = "You've Guessed: ";
        userTries.textContent = this.triesLeft;
        inputField.value = ""; //make sure field is blank upon reset
    },

    pastGuess: function(letter, state) {
        //Populate wrongGuess or rightGuess lists with the user's past guesses
        if (state == 1){
            //correct guess
            this.rightGuess.push(letter);
        }
        else if (state == 2){
            //incorrect guess
            this.wrongGuess.push(letter);
        }
    },

    displayWordBlank: function() {
        //Display answer word as '_ '
        for (i=0; i<this.answers.length; i++){
            if (isAlpha(this.answers.charCodeAt(i))){
                this.displayWord.push('_');
            }
            else{
                //if the element is not AlphaNumeric leave as is
                this.displayWord.push(this.answers[i]);
            }
        }
        userAnswer.textContent = "";
        for (j=0; j<this.displayWord.length; j++){
            userAnswer.textContent += (this.displayWord[j] + "\xa0"); 
        }
    },
};

//Functions
function isAlpha(keyCode){
    /*Function checks if input (event.keyCode) is AlphaNumeric, returns true or false
    keyCode 48-57 (0-9), 65-90 (A-Z)
    Note: Keyboard input 65-90 (A-Z == a-Z)*/
    return ((keyCode >= 65 && keyCode <= 90)||(keyCode >= 97 && keyCode <= 122));
}

function isInWord(letter){
    //Takes a 'string' and returns true if it is part of the answer, false otherwise
    return (gameCore.answers.indexOf(letter) != -1);
}

function replaceBlank(letter){
    //replace '_ ' with the correct letter according to answers and display them
    for (i=0; i<gameCore.displayWord.length; i++){
        if (letter == gameCore.answers[i]){
            gameCore.displayWord[i] = letter;
        }
    }
    userAnswer.textContent = "";
    for (j=0; j<gameCore.displayWord.length; j++){
        userAnswer.textContent += (gameCore.displayWord[j] + "\xa0"); 
    } 
}

function checkAnswer(){
    //Checks if the user got the whole word
    //returns true if match, false otherwise
    var inputWord = "";
    for (i=0; i<gameCore.displayWord.length; i++){
        inputWord += gameCore.displayWord[i];
    }
    return (inputWord == gameCore.answers);
}

//Main
//Detects a key up event to start or run game
document.onkeyup = function(event){
    if (gameCore.gameStart == false){
        //Game hasn't started, 'press anykey event' flag
        inputField.value = ""; //Redundant code to ensure field is blank
        gameCore.gameStart = true;
        instructions.textContent = "Letters ONLY please";
        gameCore.gameReset();
    }
    else if(checkAnswer()){
        //User Wins
        gameCore.gameReset();
        instructions.textContent = "Letters ONLY please";
    }
    else if (gameCore.triesLeft > 0){
        //Round is not over
        var userInput;
        var inputCode;
        if (inputField.value!=""){
            userInput = inputField.value;
            inputCode = userInput.charCodeAt(0);
            inputField.value = ""; //reset input box
        }
        else{
            userInput = event.key;
            inputCode = event.keyCode;
        }
        //var userInput = event.key;
        //Check for valid input
        if(isAlpha(inputCode)){
            var inputUpper = userInput.toUpperCase();
            //Valid Input, Start Comparing, ignore cases of repeted letter guess
            if (isInWord(inputUpper) && (gameCore.rightGuess.indexOf(inputUpper)==-1)){
                gameCore.pastGuess(inputUpper, 1);
                replaceBlank(inputUpper);
                inputField.value = ""; //Redundant code to ensure field is blank

                if(checkAnswer()){
                    //User Win Condition, 
                    //this is here so user can see the final word
                    gameCore.winCount++;
                    userWins.textContent = gameCore.winCount;
                    message.textContent = "Correct!";
                    instructions.textContent = "Depress any key to continue";
                    img.src = "assets/images/" + gameCore.imageSrc;
                }
            }
            else if ((gameCore.wrongGuess.indexOf(inputUpper)==-1) && (gameCore.rightGuess.indexOf(inputUpper)==-1)){
                gameCore.pastGuess(inputUpper, 2);
                gameCore.triesLeft--;

                if(gameCore.triesLeft == 0){
                    instructions.textContent = "Depress any key to continue";
                    message.textContent = "The correct answer was: " + gameCore.answers;
                }

                //Link values to HTML
                userGuess.textContent += (inputUpper + "\xa0");
                userTries.textContent = gameCore.triesLeft;
                inputField.value = ""; //Redundant code to ensure field is blank
            }
        }
        else{
            //Invalid Input
            alert("Please press only letters!");
            inputField.value = "";
        }

    }
    else{
        //Round Lost
        gameCore.gameReset();
        gameCore.loseCount++;
        userLoss.textContent = gameCore.loseCount;
    }

}
