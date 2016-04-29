var TelegramBot = require('node-telegram-bot-api');
const __CONFIG__ = require('./config');

var token = __CONFIG__.token;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, function (msg) {
	console.log("flush");
	//tryAgain(msg.chat.id);
	
});
