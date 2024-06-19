require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
    { command: "start", description: "Start bot" },
    { command: "hello", description: "Say hello" },
    { command: "say_hello", description: "Say hello" },
    { command: "say_hi", description: "Say hi" },
]);



bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Я бот. Тг канал: <a href='https://t.me/dery_budni'>ссылка</a>", {
parse_mode: "HTML",
});
});

bot.command('mood', async (ctx) => {
    const moodKeyboard = new Keyboard().text('Well').text('Bad').text('Good').resized().oneTime();
    await ctx.reply('How are you feeling today?', { reply_markup: moodKeyboard });
})

// reply_parameters: {
//     message_id: ctx.msg.message_id,
// }
bot.hears('ID', async (ctx) => {
    await ctx.reply('Ваш ID: ' + ctx.from.id);
})
// bot.on('msg').filter((ctx) => {
//    return ctx.from.id === 783350617
// }, async (ctx) => {
    //     await ctx.reply('Привет, админ!')
    // });
    

// bot.on("message", async (ctx) => {
//   await ctx.reply("Надо подумать....");
// });

bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
    await ctx.reply('Hello, World!');
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
bot.start();
