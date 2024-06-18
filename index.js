require("dotenv").config();
const { Bot, GrammyError, HttpError } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
    { command: "start", description: "Start bot" },
    { command: "hello", description: "Say hello" },
    { command: "say_hello", description: "Say hello" },
    { command: "say_hi", description: "Say hi" },
]);

// bot.on("message", async (ctx) => {
//   await ctx.reply("Надо подумать....");
// });

bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
    await ctx.reply('Hello, World!');
})

bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Я бот.");
});
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
