//  challenge 7

( function() {

var Question = function(question, answer, correct) {
		this.question = question;
		this.answer = answer;
		this.correct = correct;
};

var quizJava = new Question('Is javascript the best coding languaje?', ['1: True', '2: False'], '1');
var quizTeacher = new Question('What is the name of the teacher?', ['1: Mark', '2: Jane', '3: Joan'], '3');
var quizCoding = new Question('What does best describe coding?', ['1: Boring', '2: Fun', '3: Hard'], '2');

var quiz = [quizJava, quizTeacher, quizCoding];
var score = 0;

for ( var i = 1 ; i > 0 ; i++ ) {
	var questionNumber = Math.floor(Math.random() * quiz.length);

	console.log(quiz[questionNumber].question);
	console.log(quiz[questionNumber].answer);

		var user = prompt('Please select the correct answer. Select a number.', 'Type your answer or type exit to end the game');

		if (quiz[questionNumber].correct === user) {
				console.log('-----------------');
				console.log('You are correct!!');
				score++;
				console.log('Your score is ' + score);
				console.log('-----------------');
		} else if (quiz[questionNumber].correct !== user && user !== 'exit') {
				console.log('-----------------');
				console.log('Sorry, try again!!');
				console.log('-----------------');
		} else if ( user === 'exit') {
				console.log('-----------------');
				console.log('Game ended!!');
				console.log('-----------------');
				break;
		}
}

}) ();
