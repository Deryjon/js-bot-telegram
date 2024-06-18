require('dotenv').config()
const {Bot, GrammyError, HttpError} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
    await ctx.reply('Привет! Я бот.')
})

bot.on('message', async (ctx) => {
    await ctx.reply('Надо подумать....')       
})


bot.start()