//@ts-check
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TG_TOKEN || '', { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (msg.text) {
    case '/start':
      await bot.sendMessage(chatId, 'Welcome to art bot', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Оформить доставку',
                web_app: { url: '/' },
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
