'use strict';

var TelegramBot = require('node-telegram-bot-api');
const __CONFIG__ = require('./config');

//var TOKEN = '212992113:AAER5F7gY_0rN18XLLHiQu0tn_QLOYrgH54';
var TOKEN = __CONFIG__.token;
var USER = '213455963';

var bot = new TelegramBot(TOKEN, {polling: {timeout: 1, interval: 100}});

var opts = {
  reply_markup: JSON.stringify(
    {
      force_reply: true
    }
  )};
  
bot.sendMessage(USER, 'How old are you?', opts)
  .then(function (sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    console.log(chatId);
    console.log(messageId);
    bot.onReplyToMessage(chatId, messageId, function (message) {
      console.log('User is %s years old', message.text);
    });
  });