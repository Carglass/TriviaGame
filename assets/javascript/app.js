let timeoutAnswer;
let timeoutModal;

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
        let index = getRandomInt(this.questionsPool.length);
        this.currentQuestion = this.questionsPool[index];
        this.questionsPool.splice(index,1);
        this.displayCurrentQuestion();
        this.answerCountDown(8);
    },
    init: function(){
        this.questionsPool = [luffy,bakuman,ichigo,sasuke,L,WhiteBeard,Kenpachi,Gon,Urasawa];
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
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append('Congrats!');
            $("#questionScoreText").empty().append('You got it right!');
            timeoutModal = window.setTimeout(trivia.goToNextQuestion.bind(trivia),2000);
        } else {
            player.areAnswersCorrect.push(false);
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append('Too bad...');
            $("#questionScoreText").empty().append('The good answer was ' + trivia.currentQuestion.correctAnswer);
            timeoutModal = window.setTimeout(trivia.goToNextQuestion.bind(trivia),2000);
        }
    },
    goToNextQuestion: function(){
        player.displayCurrentScore();
        $("#questionScore").modal('hide');
        if (this.questionsPool.length === 0){
            this.state = "finished";
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append(player.displayFinalScore());
            $("#questionScoreText").empty().append('Pretty impressive!');
            $('#dismissModal').empty().append('Restart');
        } else {
            this.nextQuestion();
            this.state = "waitingForAnswer";
        }
        
    },
    answerCountDown: function(n){
        $('#timer').empty().append(n);
        n--;
        if(n > 0){
        timeoutAnswer = setTimeout(this.answerCountDown.bind(trivia,n),1000);
        } else {
            timeoutAnswer = setTimeout(this.validateAnswer.bind(trivia,""),1000);
            // trivia.validateAnswer("");
        }
    },
    reset: function(){
        $('#dismissModal').empty().append('Skip');
        $('#questionScore').modal('hide');
        $('#goodAnswers').empty().append('0');
        $('#totalAnswers').empty().append('0');
        this.init();
        this.nextQuestion();
        player.init();
        
    }
}

// player groups the information relative to the use, mainly his answers, score etc
let player = {
    currentAnswer: "",
    areAnswersCorrect: [], //we keep this array with booleans to count the score
    // displayCurrentScore takes care of the top right score when called
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
    displayFinalScore: function(){
        let nbCorrectAnswers = 0;
        for (let i = 0; i < this.areAnswersCorrect.length; i++){
            if (this.areAnswersCorrect[i]){
                nbCorrectAnswers++;
            }
        }
        return "Final score: " + nbCorrectAnswers + " / " + player.areAnswersCorrect.length;
    },
    init: function(){
        player.currentAnswer = "";
        player.areAnswersCorrect = [];
    },
}

let luffy = new triviaQuestion("What is the name of the captain in One Piece?",false,'Luffy',['Luffy','Zorro','Sandy','Franky']);
let bakuman = new triviaQuestion("Does Bakuman tell the story of a manga writer?",true,true);
let ichigo = new triviaQuestion("Bleach's Hero is called Ichigo, what does it mean in Japanese?",false,'strawberry',['cherry','banana','orange','strawberry']);
let sasuke = new triviaQuestion("Sasuke magic eyes are called Bakugan",true,false);
let L = new triviaQuestion('Which of these characters is not a Death Note user?', false, 'L',['Light','Ryuk', 'L', 'Misa']);
let WhiteBeard = new triviaQuestion("Which of these characters is not one of White Beard's captain?",false,'Shanks',['Ace','Falco','Shanks','Jozu']);
let Gon = new triviaQuestion("Jin is Gon's dad in Hunter X Hunter?", true, true);
let Kenpachi = new triviaQuestion("In Bleach, becoming 12th division captain is done via a duel to the death", true, false);
let Urasawa = new triviaQuestion("Which of these manga is not from Urasawa-sensei?",false,'Death Note',['Monster','20th Century Boys','Death Note','Master Keaton']);

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

    $('#dismissModal').click(function(){
        if (trivia.state === "finished") {
            trivia.reset();
        } else {
            window.clearTimeout(timeoutModal);
            trivia.goToNextQuestion();
        }
    })

});

