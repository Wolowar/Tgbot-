const Telegraf = require('telegraf');
const bot = new Telegraf('BOT_TOKEN');
const mysql = require('promise-mysql');

// Подключение к базе данных
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'database'
};

const db = await mysql.createConnection(dbConfig);

// Регистрация
bot.command('reg', async (ctx) => {
    let username = ctx.message.from.username;
    let password = ctx.message.text.split(' ')[1];
    if (!password) return ctx.reply('Укажите пароль!');
    await db.query(INSERT INTO users (username, password) VALUES (?, ?), [username, password]);
    ctx.reply('Вы успешно зарегистрированы!');
});

// Авторизация
bot.command('auth', async (ctx) => {
    let username = ctx.message.from.username;
    let password = ctx.message.text.split(' ')[1];
    if (!password) return ctx.reply('Укажите пароль!');
    let result = await db.query(SELECT * FROM users WHERE username = ? AND password = ?, [username, password]);
    if (!result.length) return ctx.reply('Неверный пароль!');
    ctx.reply('Вы успешно авторизованы!');
});

// Выход
bot.command('exit', async (ctx) => {
    ctx.reply('Вы вышли из аккаунта!');
    ctx.leaveChat();
});

// Мои данные
bot.command('my', async (ctx) => {
    let username = ctx.message.from.username;
    let result = await db.query(SELECT * FROM users WHERE username = ?, [username]);
    if (!result.length) return ctx.reply('Не найден аккаунт!');
    ctx.reply(Ваши данные: ${result[0].username});
});

// Справка
bot.command('help', async (ctx) => {
    ctx.reply(Список команд:
    /reg - регистрация
    /auth - авторизация
    /exit - выход
    /my - мои данные
    /help - справка
    /admin - информация об админе
    /list - список пользователей
    /settingsfamily - изменить фамилию
    /settingsname - изменить имя
    /settingsotchestvo - изменить отчество
    /helpadmin - отправить сообщение админу о помощи);
});

// Помощь
bot.command('helpadmin', async (ctx) => {
    ctx.telegram.sendMessage(ADMIN_ID, Пользователю ${ctx.message.from.username} требуется помощь!);
});

// Информация об админе
bot.command('admin', async (ctx) => {
    ctx.reply(Администратор:
    Имя: ${ADMIN_NAME}
    Контакт: ${ADMIN_CONTACT});
});

// Список пользователей
bot.command('list', async (ctx) => {
    let result = await db.query(SELECT * FROM users);
    if (!result.length) return ctx.reply('База данных пуста!');
    let list = Список пользователей:\n;
    result.forEach(user => {
        list += ${user.id}. ${user.username}\n;
    });
    ctx.reply(list);
});

// Изменить фамилию
bot.command('settingsfamily', async (ctx) => {
    let family = ctx.message.text.split(' ')[1];
    if (!family) return ctx.reply('Укажите фамилию!');
    let username = ctx.message.from.username;
    await db.query(UPDATE users SET family = ? WHERE username = ?, [family, username]);
    ctx.reply('Фамилия успешно изменена!');
});

// Изменить имя
bot.command('settingsname', async (ctx) => {
    let name = ctx.message.text.split(' ')[1];
    if (!name) return ctx.reply('Укажите имя!');
    let username = ctx.message.from.username;
    await db.query(UPDATE users SET name = ? WHERE username = ?, [name, username]);
    ctx.reply('Имя успешно изменено!');
});

// Изменить отчество
bot.command('settingsotchestvo', async (ctx) => {
    let otchestvo = ctx.message.text.split(' ')[1];
    if (!otchestvo) return ctx.reply('Укажите отчество!');
    let username = ctx.message.from.username;
    await db.query(UPDATE users SET otchestvo = ? WHERE username = ?, [otchestvo, username]);
    ctx.reply('Отчество успешно изменено!');
});

// Ответ на неизвестные команды
bot.on('text', async (ctx) => {
    ctx.reply('Неизвестная команда!');
});

// Запуск бота
bot.launch();
