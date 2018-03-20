// Definition of both timers in global scope to be able to clear them
let timeoutAnswer;
let timeoutModal;

// 'constructor' for trivia questions object for faster definitions
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

// trivia object, holds the properties and methods of the game
let trivia = {
    // state that defines the status of the game, different functions will come to change this in order to follow the flow of the game, 
    // state is used by the display functions for example
    state: 'init',
    currentQuestion: null, //type is triviaQuestion
    questionsPool: [], // includes originally all questions, and they are removed one by one (to avoid repetition)
    state: "", // to keep where we are in the workflow, it will be a cycle most likely
    // nextQuestion helps at moving the game to the next question, recording important information, rendering again the game
    nextQuestion: function(){
        // picking the next question randomly
        let index = getRandomInt(this.questionsPool.length);
        this.currentQuestion = this.questionsPool[index];
        // removing the picked question from the pool
        this.questionsPool.splice(index,1);
        // diplaying the new question
        this.displayCurrentQuestion();
        // launching the countdown
        this.answerCountDown(8);
    },
    // init resets the state and the question pool for a new Game
    init: function(){
        this.questionsPool = [luffy,bakuman,ichigo,sasuke,L,WhiteBeard,Kenpachi,Gon,Urasawa, Reborn];
        this.state = "waitingForAnswer";
    },
    // displays the correct fields to display the current question
    displayCurrentQuestion: function(){
        $('#question').empty().append(this.currentQuestion.question);
        if (this.currentQuestion.isYesNoQuestion){
            // based on the hidden attribute, jQuery dork functions hide and show
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
    // validate the answer and display the modal, along with its timer and the callback goToNextQuestion
    validateAnswer: function(answer){
        trivia.state = "validating";
        if (answer === trivia.currentQuestion.correctAnswer){
            // push the success or failure into our user result table
            player.areAnswersCorrect.push(true);
            // display the modal window
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append('Congrats!');
            $("#questionScoreText").empty().append('You got it right!');
            // set a timeout, along with the callback -> to be noted that we use the bind to make sure the this is the one we expect (trivia in that case)
            timeoutModal = window.setTimeout(trivia.goToNextQuestion.bind(trivia),2000);
        } else {
            player.areAnswersCorrect.push(false);
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append('Too bad...');
            $("#questionScoreText").empty().append('The good answer was ' + trivia.currentQuestion.correctAnswer);
            timeoutModal = window.setTimeout(trivia.goToNextQuestion.bind(trivia),2000);
        }
    },
    // moves to next question, or manage the end of the game
    goToNextQuestion: function(){
        // actualize player score
        player.displayCurrentScore();
        // hide the modal window
        $("#questionScore").modal('hide');
        if (this.questionsPool.length === 0){
            // manage finished game
            this.state = "finished";
            // reuse the modal window
            $("#questionScore").modal('show');
            $("#questionScoreTitle").empty().append(player.displayFinalScore());
            // I could display different messages based on the score, but I am a nice guy, I want to people to feel encouraged ;)
            $("#questionScoreText").empty().append('Pretty impressive!');
            $('#dismissModal').empty().append('Restart');
        } else {
            // if the game is not finished, we just go to the next question
            this.nextQuestion();
            this.state = "waitingForAnswer";
        }  
    },
    // timer management, I could have used setInterval, but I guess it was more fun to use a recursive function
    // n is the number of seconds
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
    // reset the game
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

// player groups the information relative to the user, mainly his answers, score etc
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
    // generates the string to display in the final modal
    displayFinalScore: function(){
        let nbCorrectAnswers = 0;
        for (let i = 0; i < this.areAnswersCorrect.length; i++){
            if (this.areAnswersCorrect[i]){
                nbCorrectAnswers++;
            }
        }
        return "Final score: " + nbCorrectAnswers + " / " + player.areAnswersCorrect.length;
    },
    // init the player at the begining of a game
    init: function(){
        player.currentAnswer = "";
        player.areAnswersCorrect = [];
    },
}

// definitions of all the questions
let luffy = new triviaQuestion("What is the name of the captain in One Piece?",false,'Luffy',['Luffy','Zorro','Sandy','Franky']);
let bakuman = new triviaQuestion("Does Bakuman tell the story of a manga writer?",true,true);
let ichigo = new triviaQuestion("Bleach's Hero is called Ichigo, what does it mean in Japanese?",false,'strawberry',['cherry','banana','orange','strawberry']);
let sasuke = new triviaQuestion("Sasuke magic eyes are called Bakugan",true,false);
let L = new triviaQuestion('Which of these characters is not a Death Note user?', false, 'L',['Light','Ryuk', 'L', 'Misa']);
let WhiteBeard = new triviaQuestion("Which of these characters is not one of White Beard's captain?",false,'Shanks',['Ace','Falco','Shanks','Jozu']);
let Gon = new triviaQuestion("Jin is Gon's dad in Hunter X Hunter?", true, true);
let Kenpachi = new triviaQuestion("In Bleach, becoming 12th division captain is done via a duel to the death", true, false);
let Urasawa = new triviaQuestion("Which of these manga is not from Urasawa-sensei?",false,'Death Note',['Monster','20th Century Boys','Death Note','Master Keaton']);
let Reborn = new triviaQuestion("the characteristic characters of Reborn are mafiosi babies", true, true);

//Utility
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// here will be defined the events, we make sure the html is loaded before defining them
$( document ).ready(function(){

    // initialization
    trivia.init();
    trivia.nextQuestion();

    // event creations
    // manage answer 'true'
    $('#true').click(function(){
        if (trivia.state === "waitingForAnswer"){
            // fills the answer
            player.currentAnswer = true;
            // stops the timeOut
            window.clearTimeout(timeoutAnswer);
            // reset the timer div
            $('#timer').empty();
            // calls for the answer validation
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    // equivalent to the ' true' click management
    $('#false').click(function(){
        if (trivia.state === "waitingForAnswer"){
            player.currentAnswer = false;
            window.clearTimeout(timeoutAnswer);
            $('#timer').empty();
            trivia.validateAnswer(player.currentAnswer);
        }
    });

    // again, it is equivalent, just with strings
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

    // would be better to use 'on' function, but, as we hide or show the modal instead of creating out of nowhere, it works, I wanted to try this way for this HomeWork
    $('#dismissModal').click(function(){
        if (trivia.state === "finished") {
            // when it is the last modal, it resets the game (we only change the label of the dismiss button to restart)
            trivia.reset();
        } else {
            // clears the timeout and moves on to the next question
            window.clearTimeout(timeoutModal);
            trivia.goToNextQuestion();
        }
    })

});

