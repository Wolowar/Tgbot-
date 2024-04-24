/*Файл Автотестов*/

// Автотесты для Регистрации

// Тест 1: Регистрация с valid данными
const data = {
  username: 'testUser',
  password: 'testPassword'
};

test('Регистрация с valid данными', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: reg ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
  expect(result[0].password).toBe(data.password);
});

// Тест 2: Регистрация с отсутствующим паролем
test('Регистрация с отсутствующим паролем', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: 'reg'
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(0);
});

// Тест 3: Повторная регистрация того же пользователя
test('Повторная регистрация того же пользователя', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: reg ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Тест 4: Регистрация с длинным именем пользователя
data.username = 'veryveryverylongusername';
test('Регистрация с длинным именем пользователя', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: reg ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Тест 5: Регистрация с длинным паролем
data.password = 'veryveryverylongpassword';
test('Регистрация с длинным паролем', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: reg ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Автотесты для авторизации

// Тест 1: Авторизация с valid данными
const data = {
  username: 'testUser',
  password: 'testPassword'
};

test('Авторизация с valid данными', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, data.password]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: auth ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Тест 2: Авторизация с отсутствующим паролем
test('Авторизация с отсутствующим паролем', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, data.password]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: 'auth'
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Тест 3: Авторизация несуществующего пользователя
test('Авторизация несуществующего пользователя', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: auth ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(0);
});

// Тест 4: Авторизация с неверным паролем
test('Авторизация с неверным паролем', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, data.password]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: auth wrongPassword
    }
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Тест 5: Повторная авторизация уже авторизованного пользователя
test('Повторная авторизация уже авторизованного пользователя', async () => {
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, data.password]);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: auth ${data.password}
    }
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result.length).toBe(1);
});

// Автотест Exit

// Тест 1: Выход из чата
test('Выход из чата', async () => {
  const ctx = {
    reply: jest.fn(),
    leaveChat: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Вы вышли из аккаунта!');
  expect(ctx.leaveChat).toHaveBeenCalledTimes(1);
});

// Тест 2: Повторный выход из чата
test('Повторный выход из чата', async () => {
  const ctx = {
    reply: jest.fn(),
    leaveChat: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
  expect(ctx.leaveChat).toHaveBeenCalledTimes(1);
});

// Тест 3: Выход из чата без авторизации
test('Выход из чата без авторизации', async () => {
  const ctx = {
    reply: jest.fn(),
    leaveChat: jest.fn()
  };
  await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(0);
  expect(ctx.leaveChat).toHaveBeenCalledTimes(0);
});

// Тест 4: Выход из чата с ошибкой
test('Выход из чата с ошибкой', async () => {
  const ctx = {
    reply: jest.fn(),
    leaveChat: jest.fn(() => {
      throw new Error('Ошибка выхода из чата');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при выходе из чата');
  expect(ctx.leaveChat).toHaveBeenCalledTimes(1);
});

// Тест 5: Выход из чата с задержкой
test('Выход из чата с задержкой', async () => {
  const ctx = {
    reply: jest.fn(),
    leaveChat: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Вы вышли из аккаунта!');
  expect(ctx.leaveChat).toHaveBeenCalledTimes(1);
});

// Автотест МоиДанные

// Тест 1: Получение информации о пользователе
test('Получение информации о пользователе', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, 'testPassword']);
  const ctx = {
    message: {
      from: {
        username: data.username
      }
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Ваши данные: ${data.username});
});

// Тест 2: Повторное получение информации о пользователе
test('Повторное получение информации о пользователе', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, 'testPassword']);
  const ctx = {
    message: {
      from: {
        username: data.username
      }
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Получение информации о пользователе без авторизации
test('Получение информации о пользователе без авторизации', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  const ctx = {
    message: {
      from: {
        username: data.username
      }
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Не найден аккаунт!');
});

// Тест 4: Получение информации о пользователе с ошибкой
test('Получение информации о пользователе с ошибкой', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, 'testPassword']);
  const ctx = {
    message: {
      from: {
        username: data.username
      }
    },
    reply: jest.fn(() => {
      throw new Error('Ошибка получения данных пользователя');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении данных пользователя');
});

// Тест 5: Получение информации о пользователе с задержкой
test('Получение информации о пользователе с задержкой', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [data.username, 'testPassword']);
  const ctx = {
    message: {
      from: {
        username: data.username
      }
    },
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Ваши данные: ${data.username});
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Ваши данные: ${data.username});
});

// Автотест Справка

// Тест 1: Получение справки
test('Получение справки', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Список команд:

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

// Тест 2: Повторное получение справки
test('Повторное получение справки', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Получение справки без авторизации
test('Получение справки без авторизации', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(0);
});

// Тест 4: Получение справки с ошибкой
test('Получение справки с ошибкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      throw new Error('Ошибка получения справки');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении справки');
});

// Тест 5: Получение справки с задержкой
test('Получение справки с задержкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Список команд:

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
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Список команд:

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

// Автотесты для помощи

// Тест 1: Отправка запроса о помощи администратору
test('Отправка запроса о помощи администратору', async () => {
  const ctx = {
    telegram: {
      sendMessage: jest.fn()
    }
  };
  await bot.handleUpdate(ctx);
  expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(ADMIN_ID, Пользователю ${ctx.message.from.username} требуется помощь!);
});

// Тест 2: Повторная отправка запроса о помощи
test('Повторная отправка запроса о помощи', async () => {
  const ctx = {
    telegram: {
      sendMessage: jest.fn()
    }
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.telegram.sendMessage).toHaveBeenCalledTimes(2);
});

// Тест 3: Отправка запроса о помощи без авторизации
test('Отправка запроса о помощи без авторизации', async () => {
  const ctx = {
    telegram: {
      sendMessage: jest.fn()
    }
  };
  await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
  await bot.handleUpdate(ctx);
  expect(ctx.telegram.sendMessage).toHaveBeenCalledTimes(0);
});

// Тест 4: Отправка запроса о помощи с ошибкой
test('Отправка запроса о помощи с ошибкой', async () => {
  const ctx = {
    telegram: {
      sendMessage: jest.fn(() => {
        throw new Error('Ошибка отправки запроса о помощи');
      })
    }
  };
  await bot.handleUpdate(ctx);
  expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(ADMIN_ID, Пользователю ${ctx.message.from.username} требуется помощь!);
});

// Тест 5: Отправка запроса о помощи с задержкой
test('Отправка запроса о помощи с задержкой', async () => {
  const ctx = {
    telegram: {
      sendMessage: jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
    }
  };
  await bot.handleUpdate(ctx);
  expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(ADMIN_ID, Пользователю ${ctx.message.from.username} требуется помощь!);
});

// Автотесты инфо об админе

// Тест 1: Получение информации об администраторе
test('Получение информации об администраторе', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Администратор:
    Имя: ${ADMIN_NAME}
    Контакт: ${ADMIN_CONTACT});
});

// Тест 2: Повторное получение информации об администраторе
test('Повторное получение информации об администраторе', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Получение информации об администраторе без авторизации
test('Получение информации об администраторе без авторизации', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(0);
});

// Тест 4: Получение информации об администраторе с ошибкой
test('Получение информации об администраторе с ошибкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      throw new Error('Ошибка получения информации об администраторе');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении информации об администраторе');
});

// Тест 5: Получение информации об администраторе с задержкой
test('Получение информации об администраторе с задержкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Администратор:
            Имя: ${ADMIN_NAME}
            Контакт: ${ADMIN_CONTACT});
        }, 1000);
      });
    })
  };
  await bot

// Автотесты для списка пользователей

// Тест 1: Получение списка пользователей
test('Получение списка пользователей', async () => {
  const data = [
    {
      id: 1,
      username: 'testUser1'
    },
    {
      id: 2,
      username: 'testUser2'
    }
  ];
  await db.query('DELETE FROM users');
  await db.query('INSERT INTO users (id, username) VALUES ?', [data]);
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Список пользователей:n1. testUser1n2. testUser2);
});

// Тест 2: Повторное получение списка пользователей
test('Повторное получение списка пользователей', async () => {
  const data = [
    {
      id: 1,
      username: 'testUser1'
    },
    {
      id: 2,
      username: 'testUser2'
    }
  ];
  await db.query('DELETE FROM users');
  await db.query('INSERT INTO users (id, username) VALUES ?', [data]);
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Получение списка пользователей без данных
test('Получение списка пользователей без данных', async () => {
  await db.query('DELETE FROM users');
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('База данных пуста!');
});

// Тест 4: Получение списка пользователей с ошибкой
test('Получение списка пользователей с ошибкой', async () => {
  const data = [
    {
      id: 1,
      username: 'testUser1'
    },
    {
      id: 2,
      username: 'testUser2'
    }
  ];
  await db.query('DELETE FROM users');
  await db.query('INSERT INTO users (id, username) VALUES ?', [data]);
  const ctx = {
    reply: jest.fn(() => {
      throw new Error('Ошибка получения списка пользователей');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении списка пользователей');
});

// Тест 5: Получение списка пользователей с задержкой
test('Получение списка пользователей с задержкой', async () => {
  const data = [
    {
      id: 1,
      username: 'testUser1'
    },
    {
      id: 2,
      username: 'testUser2'
    }
  ];
  await db.query('DELETE FROM users');
  await db.query('INSERT INTO users (id, username) VALUES ?', [data]);
  const ctx = {
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Список пользователей:n1. testUser1n2. testUser2);
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith(Список пользователей:n1. testUser1n2. testUser2);
});

// Автотесты для смены фамилии

// Тест 1: Изменение фамилии
test('Изменение фамилии', async () => {
  const data = {
    username: 'testUser',
    family: 'testFamily'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, family) VALUES (?, ?)', [data.username, 'oldFamily']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsfamily ${data.family}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].family).toBe(data.family);
  expect(ctx.reply).toHaveBeenCalledWith('Фамилия успешно изменена!');
});

// Тест 2: Повторное изменение фамилии
test('Повторное изменение фамилии', async () => {
  const data = {
    username: 'testUser',
    family: 'testFamily'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, family) VALUES (?, ?)', [data.username, 'oldFamily']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsfamily ${data.family}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].family).toBe(data.family);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Изменение фамилии без указания фамилии
test('Изменение фамилии без указания фамилии', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, family) VALUES (?, ?)', [data.username, 'oldFamily']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: 'settingsfamily'
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].family).toBe('oldFamily');
  expect(ctx.reply).toHaveBeenCalledWith('Укажите фамилию!');
});

// Тест 4: Изменение фамилии с ошибкой
test('Изменение фамилии с ошибкой', async () => {
  const data = {
    username: 'testUser',
    family: 'testFamily'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, family) VALUES (?, ?)', [data.username, 'oldFamily']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsfamily ${data.family}
    },
    reply: jest.fn(() => {
      throw new Error('Ошибка изменения фамилии');
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].family).toBe('oldFamily');
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при изменении фамилии');
});

// Тест 5: Изменение фамилии с задержкой
test('Изменение фамилии с задержкой', async () => {
  const data = {
    username: 'testUser',
    family: 'testFamily'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, family) VALUES (?, ?)', [data.username, 'oldFamily']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsfamily ${data.family}
    },
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Фамилия успешно изменена!');
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].family).toBe(data.family);
  expect(ctx.reply).toHaveBeenCalledWith('Фамилия успешно изменена!');
});

// Автотесты для смены Имени

// Тест 1: Изменение имени
test('Изменение имени', async () => {
  const data = {
    username: 'testUser',
    name: 'testName'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [data.username, 'oldName']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsname ${data.name}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].name).toBe(data.name);
  expect(ctx.reply).toHaveBeenCalledWith('Имя успешно изменено!');
});

// Тест 2: Повторное изменение имени
test('Повторное изменение имени', async () => {
  const data = {
    username: 'testUser',
    name: 'testName'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [data.username, 'oldName']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsname ${data.name}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].name).toBe(data.name);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Изменение имени без указания имени
test('Изменение имени без указания имени', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [data.username, 'oldName']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: 'settingsname'
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].name).toBe('oldName');
  expect(ctx.reply).toHaveBeenCalledWith('Укажите имя!');
});

// Тест 4: Изменение имени с ошибкой
test('Изменение имени с ошибкой', async () => {
  const data = {
    username: 'testUser',
    name: 'testName'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [data.username, 'oldName']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsname ${data.name}
    },
    reply: jest.fn(() => {
      throw new Error('Ошибка изменения имени');
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].name).toBe('oldName');
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при изменении имени');
});

// Тест 5: Изменение имени с задержкой
test('Изменение имени с задержкой', async () => {
  const data = {
    username: 'testUser',
    name: 'testName'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [data.username, 'oldName']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsname ${data.name}
    },
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Имя успешно изменено!');
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].name).toBe(data.name);
  expect(ctx.reply).toHaveBeenCalledWith('Имя успешно изменено!');
});


// Автотесты для изменения отчества

// Тест 1: Изменение отчества
test('Изменение отчества', async () => {
  const data = {
    username: 'testUser',
    otchestvo: 'testOtchestvo'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, otchestvo) VALUES (?, ?)', [data.username, 'oldOtchestvo']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsotchestvo ${data.otchestvo}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].otchestvo).toBe(data.otchestvo);
  expect(ctx.reply).toHaveBeenCalledWith('Отчество успешно изменено!');
});

// Тест 2: Повторное изменение отчества
test('Повторное изменение отчества', async () => {
  const data = {
    username: 'testUser',
    otchestvo: 'testOtchestvo'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, otchestvo) VALUES (?, ?)', [data.username, 'oldOtchestvo']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsotchestvo ${data.otchestvo}
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].otchestvo).toBe(data.otchestvo);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Изменение отчества без указания отчества
test('Изменение отчества без указания отчества', async () => {
  const data = {
    username: 'testUser'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, otchestvo) VALUES (?, ?)', [data.username, 'oldOtchestvo']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: 'settingsotchestvo'
    },
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].otchestvo).toBe('oldOtchestvo');
  expect(ctx.reply).toHaveBeenCalledWith('Укажите отчество!');
});

// Тест 4: Изменение отчества с ошибкой
test('Изменение отчества с ошибкой', async () => {
  const data = {
    username: 'testUser',
    otchestvo: 'testOtchestvo'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, otchestvo) VALUES (?, ?)', [data.username, 'oldOtchestvo']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsotchestvo ${data.otchestvo}
    },
    reply: jest.fn(() => {
      throw new Error('Ошибка изменения отчества');
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].otchestvo).toBe('oldOtchestvo');
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при изменении отчества');
});

// Тест 5: Изменение отчества с задержкой
test('Изменение отчества с задержкой', async () => {
  const data = {
    username: 'testUser',
    otchestvo: 'testOtchestvo'
  };
  await db.query('DELETE FROM users WHERE username = ?', [data.username]);
  await db.query('INSERT INTO users (username, otchestvo) VALUES (?, ?)', [data.username, 'oldOtchestvo']);
  const ctx = {
    message: {
      from: {
        username: data.username
      },
      text: settingsotchestvo ${data.otchestvo}
    },
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() =>{
          resolve('Отчество успешно изменено!');
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  const result = await db.query('SELECT * FROM users WHERE username = ?', [data.username]);
  expect(result[0].otchestvo).toBe(data.otchestvo);
  expect(ctx.reply).toHaveBeenCalledWith('Отчество успешно изменено!');
});

// Автотесты для неизвестной команды

// Тест 1: Ответ на неизвестную команду
test('Ответ на неизвестную команду', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Неизвестная команда!');
});

// Тест 2: Повторный ответ на неизвестную команду
test('Повторный ответ на неизвестную команду', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await bot.handleUpdate(ctx);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(2);
});

// Тест 3: Ответ на неизвестную команду с ошибкой
test('Ответ на неизвестную команду с ошибкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      throw new Error('Ошибка ответа на неизвестную команду');
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при обработке команды');
});

// Тест 4: Ответ на неизвестную команду с задержкой
test('Ответ на неизвестную команду с задержкой', async () => {
  const ctx = {
    reply: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Неизвестная команда!');
        }, 1000);
      });
    })
  };
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Неизвестная команда!');
});

// Тест 5: Ответ на команду без указания команды
test('Ответ на команду без указания команды', async () => {
  const ctx = {
    reply: jest.fn()
  };
  await db.query('DELETE FROM users WHERE username = ?', ['testUser']);
  await bot.handleUpdate(ctx);
  expect(ctx.reply).toHaveBeenCalledTimes(0);
});

