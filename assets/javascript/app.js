let timeoutAnswer;

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
    // cannot use this in nextquestion because of the recursivity on the timeout, which changes the scope each time
    nextQuestion: function(){
        let index = getRandomInt(trivia.questionsPool.length);
        trivia.currentQuestion = trivia.questionsPool[index];
        trivia.questionsPool.splice(index,1);
        trivia.displayCurrentQuestion();
        trivia.answerCountDown(8);
    },
    init: function(){
        this.questionsPool = [luffy,bakuman,ichigo,sasuke]; // may be replaced by a loop later by naming the question questioni maybe
        this.state = "waitingForAnswer";
    },
    displayCurrentQuestion: function(){
        $('#question').empty().append(this.currentQuestion.question);
        if (this.currentQuestion.isYesNoQuestion){
            $('#true').show();
            $('#false').show();
            $('#answer1').hide();
            $('#answer2').hide();
            $('#answer3').hide();
            $('#answer4').hide();
        } else {
            $('#true').hide();
            $('#false').hide();
            $('#answer1').show().empty().append(this.currentQuestion.answers[0]);
            $('#answer2').show().empty().append(this.currentQuestion.answers[1]);
            $('#answer3').show().empty().append(this.currentQuestion.answers[2]);
            $('#answer4').show().empty().append(this.currentQuestion.answers[3]);
        }
    },
    validateAnswer: function(answer){
        trivia.state = "validating";
        if (answer === trivia.currentQuestion.correctAnswer){
            player.areAnswersCorrect.push(true);
            console.log('congrats!');
            window.setTimeout(trivia.goToNextQuestion,2000);
        } else {
            player.areAnswersCorrect.push(false);
            console.log('Too bad...');
            window.setTimeout(trivia.goToNextQuestion,2000);
        }
    },
    goToNextQuestion: function(){
        player.displayCurrentScore();
        if (trivia.questionsPool.length === 0){
            trivia.state = "finished";
            console.log("game finished");
        } else {
            trivia.nextQuestion();
        }
        trivia.state = "waitingForAnswer";
    },
    answerCountDown: function(n){
        $('#timer').empty().append(n);
        n--;
        if(n > 0){
        timeoutAnswer = setTimeout(function(){trivia.answerCountDown(n)},1000);
        } else {
            trivia.validateAnswer("");
        }
    }
}


let player = {
    currentAnswer: "",
    areAnswersCorrect: [], //we keep this array with booleans to count the score
    displayCurrentScore: function(){
        $('#totalAnswers').empty().append(this.areAnswersCorrect.length);
        let nbCorrectAnswers = 0;
        for (let i = 0; i < this.areAnswersCorrect.length; i++){
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
            window.clearTimeout(timeoutAnswer);
            $('#timer').empty();
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    $('#false').click(function(){
        if (trivia.state === "waitingForAnswer"){
            player.currentAnswer = false;
            window.clearTimeout(timeoutAnswer);
            $('#timer').empty();
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    for (let i = 1; i <= 4; i++){
        $('#answer' + i).click(function(){
            if (trivia.state === "waitingForAnswer"){
                player.currentAnswer = $('#answer' + i).text();
                window.clearTimeout(timeoutAnswer);
                $('#timer').empty();
                trivia.validateAnswer(player.currentAnswer);
            }
        }); 
    }

});

