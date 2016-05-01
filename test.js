var TelegramBot = require('node-telegram-bot-api');
const __CONFIG__ = require('./config');

var token = __CONFIG__.token;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
require('./dbconnection')();


var imagePath = './img/';
var nextQuestionMsg = '다음 문제';
var totalMsg = '총점을 보여줘';
var tryAgainMsg = '다시 해보기';
var queryParams;

/**
 * State select
 * input  : chatId
 * output : starId, qId
 */
const selectUserStateQuery = ("SELECT starId, qId FROM UserState WHERE chatId = ?");

/**
 * State delete
 * input  : chatId
 * output : none
 */
const deleteUserStateQuery = ("DELETE FROM UserState WHERE chatId = ?");

/**
 * State insert
 * input  : chatId
 * output : none
 */
const insertUserStateQuery = ("INSERT INTO UserState(chatId) VALUES(?)");

/**
 * State update
 * input  : chatId
 * output : none
 */
const updateUserStateQuery = ("UPDATE UserState SET starId = ?, qId = ? WHERE chatId = ?");

/**
 * 스타들 select
 * input  : none
 * output : starId, name
 */
const selectStarsQuery = ("SELECT starId, name FROM Star WHERE useFlag = 1 ORDER BY name");

/**
 * 스타 select
 * input  : name
 * output : starId, name
 */
const selectStarQuery = ("SELECT starId, name FROM Star WHERE name = ? AND useFlag = 1");

/**
 * first Question select
 * input  : starId, qId
 * output : qId, starId, seq, content
 */
const selectFirstQuestionQuery = ("SELECT qId, starId, seq, content FROM Question WHERE starId = ? ORDER BY seq limit 1");

/**
 * next Question select
 * input  : starId, qId
 * output : qId, starId, seq, content
 */
const selectNextQuestionQuery = ("SELECT qId, starId, seq, content FROM Question WHERE starId = ? and seq > (SELECT seq FROM Question WHERE qId = ?) ORDER BY seq limit 1");

/**
 * 대답들 select
 * input  : qId
 * output : qId, ansId, seq, content, score
 */
const selectAnswersQuery = ("SELECT qId, ansId, seq, content, score FROM Answer WHERE qId = ? ORDER BY seq;");

/**
 * UserAnswer insert
 * input  : chatId, starId, qId, qId, content
 * output : qId, ansId, seq, content, score
 */
const insertUserAnswerQuery = ("INSERT INTO UserAnswer(chatId, starId, qId, ansId) VALUES(?, ?, ?, (SELECT ansId FROM Answer WHERE qId = ? AND content = ?)) ;");

/**
 * UserAnswer insert
 * input  : qId, content
 * output : ansId
 */
const selectAnswerQuery = ("SELECT ansId FROM Answer WHERE qId = ? AND content = ?;");

/**
 * UserAnswer delete
 * input  : chatId
 * output : none
 */
const deleteUserAnswerQuery = ("DELETE FROM UserAnswer WHERE chatId = ?");

/**
 * 토탈스코어 UserAnswer 
 * input  : chatId, starId
 * output : none
 */
const selectTotalScoreQuery = ("SELECT sum(score) as total FROM UserAnswer A, Answer B WHERE A.ansId = B.ansId AND A.chatId = ? AND A.starId = ?");

/**
 * 토탈스코어 디테일 UserAnswer 
 * input  : chatId, starId, starId
 * output : none
 */
const selectTotalScoreDetailQuery = ("SELECT D.chatId, D.starId, D.qId, D.seq, D.score, E.maxScore 	\
								FROM 															\
								(SELECT A.chatId, A.starId, A.qId, B.seq, C.score FROM UserAnswer A, Question B, Answer C WHERE A.qId = B.qId AND A.ansId = C.ansId AND A.chatId = ? AND A.starId = ?) D, \
								(SELECT A.qId, max(score) maxScore FROM Question A, Answer B WHERE A.qId = B.qId AND A.starId = ? GROUP BY A.qId) E \
								WHERE D.qId = E.qId");


/**
 * select 해설
 * input  : qId, content
 * output : seq, content, score, explanation
 */
const selectExplanationQuery = ("SELECT seq, content, score, explanation FROM Answer WHERE qId = ?");



// Matches /echo [whatever]
/*
bot.onText(/\/echo (.+)/, function (msg, match) {
  console.log('bbb');
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});
*/

function tryAgain(chatId) {
	// console.log('start ..............');
	// var chatId = msg.chat.id;
	var stars = [];
	
	queryParams = [chatId];
	connection.query(deleteUserAnswerQuery, queryParams, function(err, rows, fields) {
		if(err) {
				console.error(err);
                throw err;
        }

		queryParams = [chatId];

		//User State 삭제
		connection.query(deleteUserStateQuery, queryParams, function(err, rows, fields) {
	        if(err) {
	        		console.error(err);
	                throw err;
	        }
	        
	        //User State 초기화
	        connection.query(insertUserStateQuery, queryParams, function(err, rows, fields) {
	        	if(err) {
	        		console.error(err);
	                throw err;
	        	}

	        	//스타 보여주기 위해 가져오기
		    	connection.query(selectStarsQuery, function(err, rows, fields) {
					if(err) {
						console.error(err);
						throw err;
					}

					for(var i=0; i<rows.length; i++) {
						var index = Math.floor(i/3);
						// console.log(index);
						if(i%3 == 0)
							stars.push(new Array());
						stars[index].push(rows[i].name);
					}
					// console.log(stars);

					var opts = {
						// force_reply: JSON.stringify({
						// 	force_reply: true
						// }),
						reply_markup: JSON.stringify({
							keyboard: stars,
							one_time_keyboard: true,
							resize_keyboard: true
						}),
					};
					var genderMessage = '상대를 선택해주세요.';
					bot.sendChatAction(chatId, 'typing');
					bot.sendMessage(chatId, genderMessage, opts);
				});
	        });
		});
    });	
}

bot.onText(/\/start/, function (msg) {
	
	tryAgain(msg.chat.id);
	
});

// /로 시작하지 않는 텍스트(스타이름)
bot.onText(/^[^\/]/, function (msg) {
	
	var chatId = msg.chat.id;

	//다음 문제를 선택했다면
	if(msg.text == nextQuestionMsg) {
		queryParams = [chatId];
		//State를 가져온다.
		connection.query(selectUserStateQuery, queryParams, function(err, rows, fields) {
			if(err) {
				console.error(err);
				throw err;
			}
			var starId = rows[0].starId;
			var qId = rows[0].qId;

			queryParams = [starId, qId];
	    	//다음문제를 가져온다.
	    	connection.query(selectNextQuestionQuery, queryParams, function(err, rows, fields) {
				if(err) {
					console.error(err);
	                throw err;
	        	}
	        	
	        	var qId = rows[0].qId;
	        	var content = rows[0].content;
	        	
	        	queryParams = [qId];
	        	//대답들을 가져온다.
	        	connection.query(selectAnswersQuery, queryParams, function(err, ansRows, fields) {
	        		if(err) {
	        			console.error(err);
		                throw err;
		        	}
		        	var answers = [];
		        	for(var i=0; i<ansRows.length; i++) {
		        		answers.push(new Array());
		        		answers[i].push(ansRows[i].content);
		        	}

		        	var photo = imagePath + qId + '.jpg';
		        	var opts = {
	        			caption: content,
						 force_reply: JSON.stringify({
							force_reply: true
						}),
						reply_markup: JSON.stringify({
							keyboard: answers,
							one_time_keyboard: true,
							resize_keyboard: true
						})
					};		
					//bot.sendMessage(chatId, msg.text);
					bot.sendChatAction(chatId, 'upload_photo');
					bot.sendPhoto(chatId, photo, opts).then(function (sended) {
					    queryParams = [starId, qId, chatId];
					    //User State 변경
			        	connection.query(updateUserStateQuery, queryParams, function(err, rows, fields) {
			        		if(err) {
			        			console.error(err);
				                throw err;
				        	}
				        });
					});
		        });
			});
		});
	}
	// 총점 보기를 선택했을 때
	else if(msg.text == totalMsg) {
		
		queryParams = [chatId];
		//State를 가져온다.
		connection.query(selectUserStateQuery, queryParams, function(err, rows, fields) {
			if(err) {
				console.error(err);
				throw err;
			}
			var starId = rows[0].starId;
			//var qId = rows[0].qId;

			queryParams = [chatId, starId, starId];
	    	//대답들을 가져온다.
	    	connection.query(selectTotalScoreDetailQuery, queryParams, function(err, rows, fields) {
	    		if(err) {
	    			console.error(err);
	                throw err;
	        	}
	        	// console.log(rows);
	        	var myScore = 0;
	        	var totalScore = 0;
	        	var totalDetailMsg = '';
	        	for(var i=0; i<rows.length; i++) {
	        		totalDetailMsg += (rows[i].seq)+'번: ' + rows[i].score + '/' + rows[i].maxScore + '\r\n';
	        		myScore += rows[i].score;
	        		totalScore += rows[i].maxScore;
	        	}
	        	totalDetailMsg += '\r\n총점: ' + myScore + '/' + totalScore;

	        	var opts = {
					force_reply: JSON.stringify({
						force_reply: true
					}),
					reply_markup: JSON.stringify({
						keyboard: [[tryAgainMsg]],
						one_time_keyboard: true,
						resize_keyboard: true
					})
					
				};
				bot.sendChatAction(chatId, 'typing');
				bot.sendMessage(chatId, totalDetailMsg, opts);
        	});
	    });
	}
	// try again를 선택했을 때
	else if(msg.text == tryAgainMsg) {
		tryAgain(chatId);
	}
	else {
		queryParams = [chatId];
		// console.log(msg.text);

		connection.query(selectUserStateQuery, queryParams, function(err, rows, fields) {
			if(err) {
				console.error(err);
				throw err;
			}
			var starId = rows[0].starId;
			var qId = rows[0].qId;

			//starId가 정의되지 않았다면..
			if(starId == undefined) {
				queryParams = [msg.text];
				//starId를 가져온다.
				connection.query(selectStarQuery, queryParams, function(err, rows, fields) {
		        	if(err) {
		        		console.error(err);
		                throw err;
		        	}
		        	
		        	//잘못 입력 처리
		        	if(rows.length == 0) {
		        		return;
		        	}

		        	// console.log(rows);
		        	starId = rows[0].starId;

		        	queryParams = [starId];
		        	//다음문제를 가져온다.
		        	connection.query(selectFirstQuestionQuery, queryParams, function(err, rows, fields) {
						if(err) {
							console.error(err);
			                throw err;
			        	}
			        	var qId = rows[0].qId;
			        	var content = rows[0].content;
			        	
			        	queryParams = [qId];
			        	//대답들을 가져온다.
			        	connection.query(selectAnswersQuery, queryParams, function(err, ansRows, fields) {
			        		if(err) {
			        			console.error(err);
				                throw err;
				        	}
				        	var answers = [];
				        	for(var i=0; i<ansRows.length; i++) {
				        		answers.push(new Array());
				        		answers[i].push(ansRows[i].content);
				        	}

				        	var photo = imagePath + qId + '.jpg';
				        	var opts = {
			        			caption: content,
								 force_reply: JSON.stringify({
									force_reply: true
								}),
								reply_markup: JSON.stringify({
									keyboard: answers,
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};
							//bot.sendMessage(chatId, msg.text);
							bot.sendChatAction(chatId, 'upload_photo');
							bot.sendPhoto(chatId, photo, opts).then(function (sended) {
							    queryParams = [starId, qId, chatId];
							    //User State 변경
					        	connection.query(updateUserStateQuery, queryParams, function(err, rows, fields) {
					        		if(err) {
					        			console.error(err);
						                throw err;
						        	}
						        });
							});
				        });
	        		});
	        	});
			}
			//starId가 있다면..(진행중이라면)
			else {
				queryParams = [qId, msg.text];
				connection.query(selectAnswerQuery, queryParams, function(err, rows, fields) {
					if(err) {
						console.error(err);
		                throw err;
		        	}

		        	//잘못 입력 방지
		        	if(rows.length == 0) {
		        		return;
		        	}

					queryParams = [chatId, starId, qId, qId, msg.text];
					//스코어를 UserAnswer 테이블에 기록한다.
					connection.query(insertUserAnswerQuery, queryParams, function(err, rows, fields) {
						if(err) {
							console.error(err);
			                throw err;
			        	}
			        	// console.log('기록됨');
			        	
			        	queryParams = [starId, qId];
				    	//다음문제를 가져온다.
				    	connection.query(selectNextQuestionQuery, queryParams, function(err, rows, fields) {
							if(err) {
								console.error(err);
				                throw err;
				        	}

				        	var finalMsg;
				        	//다음 문제가 있을 때
				        	if(rows.length > 0) {
				        		finalMsg = nextQuestionMsg;
				        	}
				        	//다음 문제가 없을 때
				        	else {
				        		finalMsg = totalMsg;
				        	}

				        	var opts = {
								force_reply: JSON.stringify({
									force_reply: true
								}),
								reply_markup: JSON.stringify({
									keyboard: [[finalMsg]],
									one_time_keyboard: true,
									resize_keyboard: true
								})	
							};

				        	queryParams = [qId];
				        	connection.query(selectExplanationQuery, queryParams, function(err, rows, fields) {
				        		if(err) {
				        			console.error(err);
					                throw err;
					        	}

					        	var explanation;
					        	var score;

					        	for(var i=0; i<rows.length; i++) {
					        		if(rows[i].content == msg.text) {
					        			explanation = rows[i].explanation;
					        			score = rows[i].score;
					        			break;
					        		}
					        	}
					        	var exp = explanation + '\r\n\r\n';
					        	if(score >= 0)
					        		exp += '+';
					        	exp += score + '점';
					        	bot.sendChatAction(chatId, 'typing');
					        	bot.sendMessage(chatId, exp, opts);
							});
			        	});
					});
				});
			}
		});
	}
});
