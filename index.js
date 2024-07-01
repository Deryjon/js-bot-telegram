require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard } = require("grammy");
const { Client } = require('pg');

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// Подключение к базе данных PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL // рекомендую использовать переменную окружения для хранения строки подключения
});

client.connect();

// Установка команд бота
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

bot.command("my_profile", async (ctx) => {
  const userId = ctx.from.id;

  // Получение данных пользователя из базы данных
  const result = await client.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  let user;
  if (result.rows.length > 0) {
    user = result.rows[0];
  } else {
    // Если пользователь не найден, добавляем его в базу данных
    const username = ctx.from.username || "Нет";
    const firstName = ctx.from.first_name;

    await client.query(
      'INSERT INTO users (id, username, first_name) VALUES ($1, $2, $3)',
      [userId, username, firstName]
    );

    user = { id: userId, username, first_name: firstName, phone_number: "Нету" };
  }

  await ctx.reply(
    `Ваш профиль \n\n🆔: ${user.id}\n👤: ${user.username}\n🔤: ${user.first_name}\n📞: ${user.phone_number || "Нету"}`
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
  const userId = ctx.from.id;
  const contact = ctx.message.contact;

  // Обновление номера телефона пользователя в базе данных
  await client.query(
    'UPDATE users SET phone_number = $1 WHERE id = $2',
    [contact.phone_number, userId]
  );

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
