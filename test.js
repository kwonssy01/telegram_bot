var TelegramBot = require('node-telegram-bot-api');

var token = '212992113:AAER5F7gY_0rN18XLLHiQu0tn_QLOYrgH54';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  console.log('bbb');
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  //var photo = 'cats.png';
  bot.sendMessage(chatId, msg.text);
  //bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
});
