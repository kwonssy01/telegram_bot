var TelegramBot = require('node-telegram-bot-api');
const __CONFIG__ = require('./config');

var token = __CONFIG__.token;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

var newGagMsg = '아재개그를 줘';
var recommandGagMsg = '아재개그 제안하기';
var todayGagMsg = '오늘의 아재개그';

bot.onText(/\/start/, function (msg) {
	
	var chatId = msg.chat.id;
	var opts = {
		force_reply: JSON.stringify({
			force_reply: true
		}),
		reply_markup: JSON.stringify({
			keyboard: [
				[newGagMsg],
				[recommandGagMsg],
				[todayGagMsg]
			]
		})
	};
	var genderMessage = '안녕하세요?';
	bot.sendMessage(chatId, genderMessage, opts);
});

bot.onText(new RegExp(newGagMsg), newGag);

bot.onText(new RegExp(recommandGagMsg), function (msg) {
	// console.log(msg);
	
});

bot.onText(new RegExp(todayGagMsg), function (msg) {
	// console.log(msg);
	
});

bot.onText(/Good/, function (msg) {
	// console.log(msg);
	
	newGag(msg);
});

bot.onText(/Die/, function (msg) {
	// console.log(msg);
	
	newGag(msg);
});

function newGag(msg) {
	var chatId = msg.chat.id;
	//console.log(chatId);
	//bot.sendMessage(fromId, resp);
	var opts = {
		force_reply: JSON.stringify({
			force_reply: true
		}),
		reply_markup: JSON.stringify({
			keyboard: [
				['Good', 'Die'],
				['Copy', 'Keep']
			]
		})
	};
	var genderMessage = '세상에서 가장 야한 채소는? \r\n\r\n\r\n→ 버섯ㅋㅋㅋ';
	//bot.sendMessage(chatId, '안녕하세요? 성별이 어떻게 되시나요?');
	bot.sendMessage(chatId, genderMessage, opts);
}

// Matches /love
bot.onText(/\/settings/, function (msg) {
	var chatId = msg.chat.id;
	
  	var opts = {
    	//reply_to_message_id: msg.message_id,
			reply_markup: JSON.stringify({
				force_reply: true,
				hide_keyboard: true,
				keyboard: [
					['/start'],
					['/love'],
					['C'],
					['D']]
				})
	};

    bot.sendMessage(chatId, '설정 모드로 들어갑니다.', opts).then(function (sended) {
 		console.log('testing..');
    	// bot.onReplyToMessage(sended.chat.id, sended.message_id, function (message) {
	    //   console.log('User is %s years old', message.text);
	    // });
    });

});

function good() {

}