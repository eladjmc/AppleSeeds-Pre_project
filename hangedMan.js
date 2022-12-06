// #####################################################################################################
// #                                                                                                   #
// #                               Imports and global variables                                        #
// #                                                                                                   #
// #####################################################################################################
const figlet = require('figlet');
const prompt = require("prompt-sync")({ sigint: true }); // Make sure to install prompt-sync with |-> npm i prompt-sync <-|
let wordToBeGuessed = "testword";
let currentCensoredWord = "";
let isGameEnded = false;
let attemptsLeft = 10;
let oldGuessesList = [];

// #####################################################################################################
// #                                                                                                   #
// #                               Main function logic                                                 #
// #                                                                                                   #
// #####################################################################################################
const main = () => {
    const arrayOfRandomWords = ["Elad","will","Pass","This","Stage"];
    const randomWordIndex = Math.floor(Math.random() * arrayOfRandomWords.length); // Random number(0-4)
    wordToBeGuessed = arrayOfRandomWords[randomWordIndex];
    currentCensoredWord = "*".repeat(wordToBeGuessed.length); //Repeat take a number as argument and the string repeat itself for that number of times
    printGameInitText();
    while(!isGameEnded){
        const userInput = play();
        checkUserInput(userInput);
        attemptsLeft--;
        if (attemptsLeft === 0){
            lose();
        }
    }
}

// #####################################################################################################
// #                                                                                                   #
// #                       Functions decelerations and implementations                                 #
// #                                                                                                   #
// #####################################################################################################

// Display the logo
const printGameInitText = () => {

    console.log(figlet.textSync('HangedMan!', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 200,
        whitespaceBreak: true
    }));

}

// Print current known letters (format: S**g*), asks and returns the user input
const play = () => {
    console.log(`You have ${attemptsLeft} guesses\nThe word is:\n${currentCensoredWord}`);
    console.log("What is you guess?");
    let guess = prompt('\x1b[31m',''); // Color red
    process.stdout.write('\x1b[0m'); // Default color
    return guess;
}

// Handles the user input and analyze it
const checkUserInput = (guess) => {
    if (/[^a-zA-Z]+/.test(guess)){
        console.log(`\x1b[31m${guess}\x1b[0m is invalid, please try again!`);
        attemptsLeft++;
        return;
    }
    guess=guess.toLowerCase();

    if (guess === wordToBeGuessed.toLowerCase()){ // Bonus - excepts the full word as a win, other words will not loss a turn for the player
        win();
    }
    else if (guess.length > 1) {
        console.log("Please enter only one character");
        attemptsLeft++;
        return;
    }
    else if (wordToBeGuessed.toLowerCase().includes(guess)) {
        reveal(guess);
    }


}
// Win condition is met
const win = () => {
    console.log(`You WON! the word is ${wordToBeGuessed}`);
    isGameEnded = true;
}

// Lose condition is met
const lose = () => {
    console.log(`You LOST! the word was ${wordToBeGuessed}`);
    isGameEnded = true;
}

//  After getting a valid input from the user this is the logic of the turn
const reveal = (char) => {
    let isMatchingLetterFound = false;
    if(oldGuessesList.includes(char)){ // Checks if the letter already been found by the user and inform him if it was
        console.log(`Already guessed: \x1b[31m${char}\x1b[0m`);
        attemptsLeft++;
        return;
    }
    const tempWord = wordToBeGuessed.toLowerCase().split('');
    const tempRevealedWord = currentCensoredWord.split('');
    for (let i = 0; i < tempWord.length; i++){
        if (tempWord[i] === char) {
            isMatchingLetterFound = true;
            tempRevealedWord[i]=char; // Replacing '*' sign with the user input letter
            if (i === 0) {
                tempRevealedWord[i]=tempRevealedWord[i].toUpperCase(); // cosmetics - first letter is a capital letter
            }
        }
    }
    if(isMatchingLetterFound) {
        oldGuessesList.push(char);
        attemptsLeft++;
    }
    currentCensoredWord = tempRevealedWord.join('');
    if(!currentCensoredWord.includes('*')) { // Checks win condition (no more *'s)
        win();
    }
}

//******************    Main function call   ******************\\

main();
