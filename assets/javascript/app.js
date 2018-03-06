function triviaQuestion(question,isYesNoQuestion, answers){
    this.question = question;
    this.isYesNoQuestion = isYesNoQuestion;
    if (!isYesNoQuestion){
        this.answers = new Array(answers.length);
        for (let i = 0; i < answers.length; i++){
            this.answers[i] = answers[i];
        }
    } else {
        this.answers = answers;
    }
}

let trivia = {
    currentQuestion: null, //type is triviaQuestion
    questions: [], // we add questions one by one when the user goes to the next question
    areAnswersCorrect: [], //we keep this array with booleans to count the score
    state: "",
}

//Utility
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}