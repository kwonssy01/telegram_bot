var TelegramBot = require('node-telegram-bot-api');
const __CONFIG__ = require('./config');

var token = __CONFIG__.token;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  console.log('bbb');
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/start/, function (msg) {
	console.log('start');
	var chatId = msg.chat.id;
	console.log(chatId);
	//bot.sendMessage(fromId, resp);
	var opts = {
		force_reply: JSON.stringify({
			force_reply: true
		}),
		reply_markup: JSON.stringify({
			keyboard: [
				['남','여']
			]
		})
	};
	var genderMessage = '안녕하세요? 성별이 어떻게 되시나요?';
	//bot.sendMessage(chatId, '안녕하세요? 성별이 어떻게 되시나요?');
	bot.sendMessage(chatId, genderMessage, opts);
});

bot.onText(/[남여]/, function (msg) {
	console.log(msg);
	var chatId = msg.chat.id;
	var opts = {
		reply_markup: JSON.stringify({
			keyboard: [
				['김태희','이나영']
			]
		})
	};
	var genderMessage = '오? 진자?';
	//bot.sendMessage(chatId, '안녕하세요? 성별이 어떻게 되시나요?');
	bot.sendMessage(chatId, genderMessage, opts);
});


// Matches /love
bot.onText(/\/love/, function (msg) {
	var chatId = msg.chat.id;
	// photo can be: a file path, a stream or a Telegram file_id
	var photo = 'img/Yuri.jpg';
	//bot.sendMessage(chatId, msg.text);
	bot.sendPhoto(chatId, photo, {caption: '유리의 유혹'});

  	var opts = {
    	//reply_to_message_id: msg.message_id,
			reply_markup: JSON.stringify({
				force_reply: true,
				hide_keyboard: true,
				keyboard: [
					['A'],
					['B'],
					['C'],
					['D']]
				})
	};

    bot.sendMessage(chatId, '어떻게 할까??', opts).then(function (sended) {
 		console.log('testing..');
    	// bot.onReplyToMessage(sended.chat.id, sended.message_id, function (message) {
	    //   console.log('User is %s years old', message.text);
	    // });
    });

});

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



/*
// Any kind of message
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	console.log(chatId);
	// photo can be: a file path, a stream or a Telegram file_id
	// var photo = 'img/sample.png';
	var photo = 'img/Yuri.jpg';
	//bot.sendMessage(chatId, msg.text);
	bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
});

*/