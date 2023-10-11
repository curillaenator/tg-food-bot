//@ts-check
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TG_TOKEN || '', { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case '/start':
      await bot.sendMessage(chatId, 'Have fun with', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Pixpax',
                web_app: { url: process.env.APP_URL || '' },
              },
            ],
          ],
        },
      });
      break;

    default:
      bot.sendMessage(chatId, '/start is what you need!');
      break;
  }
});
