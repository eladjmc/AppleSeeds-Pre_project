
const figlet = require('figlet');
const prompt = require("prompt-sync")({ sigint: true });
let wordToBeGuessed = "testword";
let currentCensoredWord = "";
let isGameEnded = false;
let attemptsLeft = 10;
oldGuessesList =[];

const main = () => {
    const arrayOfRandomWords = ["Elad","will","Pass","This","Stage"];
    const randomWordIndex = Math.floor(Math.random() * arrayOfRandomWords.length);
    wordToBeGuessed = arrayOfRandomWords[randomWordIndex];
    currentCensoredWord = "*".repeat(wordToBeGuessed.length);
    printGameInitText();
    while(!isGameEnded){
        const userInput = play(attemptsLeft);
        checkUserInput(userInput);
        attemptsLeft--;
        if (attemptsLeft===0){
            lose();
        }
    }
}
const printGameInitText = () => {

    console.log(figlet.textSync('HangedMan!', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 200,
        whitespaceBreak: true
    }));

}

const play = (attemptsLeft) => {
    console.log(`You have ${attemptsLeft} guesses\nThe word is:\n${currentCensoredWord}`);
    console.log("What is you guess?");
    let guess = prompt('\x1b[31m','');
    process.stdout.write('\x1b[0m');
    return guess;
}

const checkUserInput = (guess) => {
    if (/[^a-zA-Z]+/.test(guess)){
        console.log(`\x1b[31m${guess}\x1b[0m is invalid, please try again!`);
        attemptsLeft++;
        return;
    }
    guess=guess.toLowerCase();
    if (guess === wordToBeGuessed.toLowerCase()){
        win();
    }
    if (guess.length > 1) {
        console.log("Please enter only one character");
        attemptsLeft++;
        return;
    }
    if (wordToBeGuessed.toLowerCase().includes(guess)) {
        reveal(guess);
    }


}
const win = () => {
    console.log(`You WON! the word is ${wordToBeGuessed}`);
    isGameEnded = true;
}

const lose = () => {
    console.log(`You LOST! the word was ${wordToBeGuessed}`);
    isGameEnded = true;
}


const reveal = (char) => {
    isMatchingLetterFound = false;
    if(oldGuessesList.includes(char)){
        console.log(`Already guessed: \x1b[31m${char}\x1b[0m`);
        attemptsLeft++;
        return;
    }
    const tempWord = wordToBeGuessed.toLowerCase().split('');
    const tempRevealedWord = currentCensoredWord.split('');
    for (let i = 0; i < tempWord.length; i++){
        if (tempWord[i] === char) {
            isMatchingLetterFound = true;
            if (tempWord[i].toLowerCase() === tempRevealedWord[i]){
                console.log(`Already guessed: ${char}`);
            }
            tempRevealedWord[i]=char;
            if (i === 0) {
                tempRevealedWord[i]=tempRevealedWord[i].toUpperCase();
            }
        }
    }
    if(isMatchingLetterFound) {
        oldGuessesList.push(char);
        attemptsLeft++;
    }
    currentCensoredWord = tempRevealedWord.join('');
    if(!currentCensoredWord.includes('*')) {
        win();
    }
}


main();