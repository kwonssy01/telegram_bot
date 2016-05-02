var express = require('express');
var router = express.Router();
require('./dbconnection')();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: '코메라: 냄새맡는 카메라' });
});
*/



const homeURL = ("/:chatId/:starId/:tryNum");

/**
 * 대답들 select
 * input  : chatId, starId, try
 * output : qId, question, seq, answer, explanation, score, selected
 */
const selectResultQuery = ("SELECT Question.qId, Question.content as question, Answer.seq, Answer.content as answer, Answer.explanation, Answer.score, IF(UserResult.ansId = Answer.ansId, 1, 0) AS selected  	\
							FROM UserResult INNER JOIN Question RIGHT OUTER JOIN Answer 																														\
							ON UserResult.qId = Question.qId AND UserResult.qId = Answer.qId 																													\
							WHERE UserResult.chatId = ? AND UserResult.starId = ? AND UserResult.try = ?		 																								\
							ORDER BY Question.seq, Answer.seq;");

/**
 * 토탈스코어 디테일 UserAnswer 
 * input  : chatId, starId, try
 * output : score, maxScore
 */
const selectTotalScoreQuery = ("SELECT sum(score) as score, sum(maxScore) as maxScore \
                                FROM UserResult INNER JOIN Answer INNER JOIN (SELECT qId, max(score) as maxScore FROM Answer GROUP BY qId) A \
                                ON UserResult.ansId = Answer.ansId AND UserResult.qId = A.qId \
                                WHERE UserResult.chatId = ? AND UserResult.starId = ? AND UserResult.try = ?");

var queryParams;

//index.ejs 홈
router.get(homeURL, home);
function home(req, res, next) {
	const chatId = req.params.chatId;
    const starId = req.params.starId;
    const tryNum = req.params.tryNum;
    console.log(chatId);
    console.log(starId);
    console.log(tryNum);
    var data = {};
    data['title'] = '썸타';
    
    queryParams = [chatId, starId, tryNum];
    connection.query(selectTotalScoreQuery, queryParams, function(err, totalRows, fields) {
        if(err) {
            throw err;
        }
        data['total'] = totalRows;

        queryParams = [chatId, starId, tryNum];
        connection.query(selectResultQuery, queryParams, function(err, rows, fields) {
            if(err) {
                throw err;
            }
            data['results'] = rows;
            // res.send(rows);
        	res.render('index', data);
        });
    });


}
/*
router.post(addCommentURL, addComment);
function addComment(req, res, next) {
    const imageId = req.body.imageId;
    const author = req.body.author;
    const content = req.body.content;
    const queryParams = [imageId, author, content];
    //console.log(queryParams);
    connection.query(addCommentQUERY, queryParams, function(err, rows, fields) {
        if(err) {
                throw err;
        }
		const queryParams2 = [imageId];
		connection.query(selectCommentsByImageIdQuery, queryParams2, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                res.json(rows);
        });
    });
}

router.get(selectMorePostsURL, selectMorePosts);
function selectMorePosts(req, res, next) {
    const imageId = req.params.imageId;    
    const queryParams = [imageId];  
    var result = {};
    connection.query(selectMorePostsQuery, queryParams, function(err, rows, fields) {
        if(err) {
                throw err;
        }
        result["posts"] = rows;
        const queryParams2 = [imageId];
        connection.query(selectMoreCommentsQuery, queryParams2, function(err, rows2, fields) {
                if(err) {
                        throw err;
                }
                result["comments"] = rows2;
                res.json(result);
        });
    });
}

//index.ejs 홈
router.get(setLocationURL, setLocation);
function setLocation(req, res, next) {
    var data = {};
    data['title'] = '코메라 센서 위치 수정';
    connection.query(selectLocationsQuery, function(err, rows, fields) {
        if(err) {
            throw err;
        }
        data['locations'] = rows;
        
        res.render('setLocation', data);
    });

}

router.post(updateLocationURL, updateLocation);
function updateLocation(req, res, next) {
    const sensorId = req.body.sensorId;
    const loc = req.body.loc;
    const queryParams = [loc, sensorId];
    //console.log(queryParams);
    connection.query(updateLocationQUERY, queryParams, function(err, rows, fields) {
        if(err) {
                throw err;
        }
        res.redirect(setLocationURL);
    });
}

//index.ejs 홈
router.get(getDateURL, getDateTime);
function getDateTime(req, res, next) {
    
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();
    year %= 100;

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    // res.writeHead(200, {'Content-Type': 'text/html'});
    var result = {};
    result["time"] = year+""+month+""+day;
    res.json(result);
    

}
*/

module.exports = router;
