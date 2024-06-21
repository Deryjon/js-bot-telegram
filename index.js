require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard } = require("grammy");

const bot = new Bot(process.env.BOT_TOKEN);
const api = 'postgresql://postgres:CqmwWyTqQDahXiUpcQdCJDhxuwylXFBM@monorail.proxy.rlwy.net:35376/railway'

bot.api.setMyCommands([
  { command: "start", description: "Старт бот" },
  { command: "my_profile", description: "Мой профиль" },
]);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Привет! Я бот. Тг канал: <a href='https://t.me/dery_budni'>ссылка</a>",
    {
      parse_mode: "HTML",
    }
  );
});

bot.hears("ID", async (ctx) => {
  await ctx.reply("Ваш ID: " + ctx.from.id);
});
// bot.on('msg').filter((ctx) => {
//    return ctx.from.id === 783350617
// }, async (ctx) => {
//     await ctx.reply('Привет, админ!')
// });

// bot.on("message", async (ctx) => {
//   await ctx.reply("Надо подумать....");
// });
bot.command("my_profile", async (ctx) => {
  await ctx.reply(
    `Ваш профиль \n\n🆔: ${ctx.from.id}\n👤: ${ctx.from.username || "Нет"}\n🔤: ${ctx.from.first_name}\n📞: Нету`
  );

  // Создаем клавиатуру с кнопкой для запроса номера телефона
  const phoneKeyboard = new Keyboard()
    .requestContact('Отправить свой номер телефона').resized();

  await ctx.reply("Можете добавить свой номер телефона!", {
    reply_markup: { keyboard: phoneKeyboard.build() }
  });
});

// Обрабатываем получение номера телефона
bot.on("message:contact", async (ctx) => {
  const contact = ctx.message.contact;
  await ctx.reply(`Спасибо! Ваш номер телефона: ${contact.phone_number}`, {
    reply_markup: { remove_keyboard: true }
  });
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
