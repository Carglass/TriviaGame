function triviaQuestion(question,isYesNoQuestion, correctAnswer, answers = []){
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
    this.correctAnswer = correctAnswer;
}

let trivia = {
    state: 'init',
    currentQuestion: null, //type is triviaQuestion
    questionsPool: [], // includes originally all questions, and they are removed one by one (to avoid repetition)
    state: "", // to keep where we are in the workflow, it will be a cycle most likely
    checkAnswer: function(){},
    nextQuestion: function(){
        let index = getRandomInt(this.questionsPool.length);
        this.currentQuestion = this.questionsPool[index];
        this.questionsPool.splice(index,1);
        this.displayCurrentQuestion();
    },
    init: function(){
        this.questionsPool = [luffy,bakuman,ichigo,sasuke]; // may be replaced by a loop later by naming the question questioni maybe
        this.state = "waitingForAnswer";
    },
    displayCurrentQuestion: function(){
        $('#question').empty().append(this.currentQuestion.question);
        if (this.currentQuestion.isYesNoQuestion){
            console.log('run yes');
            $('#true').show();
            $('#false').show();
            $('#answer1').hide();
            $('#answer2').hide();
            $('#answer3').hide();
            $('#answer4').hide();
        } else {
            console.log('run choice');
            $('#true').hide();
            $('#false').hide();
            $('#answer1').show().empty().append(this.currentQuestion.answers[0]);
            $('#answer2').show().empty().append(this.currentQuestion.answers[1]);
            $('#answer3').show().empty().append(this.currentQuestion.answers[2]);
            $('#answer4').show().empty().append(this.currentQuestion.answers[3]);
        }
    },
    validateAnswer: function(answer){
        if (answer === this.currentQuestion.correctAnswer){
            player.areAnswersCorrect.push(true);
        } else {
            player.areAnswersCorrect.push(false);
        }
        player.displayCurrentScore();
        if (this.questionsPool.length === 0){
            console.log("game finished");
        } else {
            this.nextQuestion();
        }
    },
}

let player = {
    currentAnswer: "",
    areAnswersCorrect: [], //we keep this array with booleans to count the score
    displayCurrentScore: function(){
        $('#totalAnswers').empty().append(this.areAnswersCorrect.length);
        let nbCorrectAnswers = 0;
        for (let i = 0; i < this.areAnswersCorrect.length; i++){
            console.log(this.areAnswersCorrect[i]);
            if (this.areAnswersCorrect[i]){
                nbCorrectAnswers++;
            }
        }
        $('#goodAnswers').empty().append(nbCorrectAnswers);
    },
}

let luffy = new triviaQuestion("What is the name of the captain in One Piece?",false,'Luffy',['Luffy','Zorro','Sandy','Franky']);
let bakuman = new triviaQuestion("Does Bakuman tell the story of a manga writer?",true,true);
let ichigo = new triviaQuestion("Bleach's Hero is called Ichigo, what does it mean in Japanese?",false,'strawberry',['cherry','banana','orange','strawberry']);
let sasuke = new triviaQuestion("Sasuke magic eyes are called Bakugan",true,false);

//Utility
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

$( document ).ready(function(){

    // initialization
    trivia.init();
    trivia.nextQuestion();

    // event creations
    $('#true').click(function(){
        if (trivia.state === "waitingForAnswer"){
            player.currentAnswer = true;
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    $('#false').click(function(){
        if (trivia.state === "waitingForAnswer"){
            player.currentAnswer = false;
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    for (let i = 1; i <= 4; i++){
        $('#answer' + i).click(function(){
            if (trivia.state === "waitingForAnswer"){
                player.currentAnswer = $('#answer' + i).text();
                trivia.validateAnswer(player.currentAnswer);
            }
        }); 
    }

});

