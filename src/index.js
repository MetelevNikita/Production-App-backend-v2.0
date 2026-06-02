import express from "express";
import fs from 'fs'
import cors from "cors";
import path from "path"
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import fetch from "node-fetch";

// bot

import { getTelegramBot } from "./lib/telegramBot.js";
import { getYGSticker } from "./function/getYouGileSticker.js";

//

import { getMessageYouGile } from "./lib/getMessageYouGile.js";
import { moveMessageYouGile } from "./lib/moveMessageYouGile.js";

// log

import logger from './logger.js';

// prisma

import { prisma } from './lib/prisma.js'


dotenv.config({
  path: path.join(process.cwd(), "./.env")
});

// module

import messageRouter from "./router/messageRouter.js";


// yougile

const url = process.env.YG_URL;



const getYGApiKey = async () => {
  try {
    const responceCompany = await fetch(`${url}auth/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({login: 'Kyle.B@mail.ru', password: 'Metelev1989'})
    })

    const dataCompany = await responceCompany.json();

    if (!dataCompany) {
      console.log(`Пользователь не авторизован в YouGile ${error.code}`);
      return
    }


    const responceApiKey = await fetch(`${url}auth/keys/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({login: 'Kyle.B@mail.ru', password: 'Metelev1989', companyId: dataCompany.content[3].id})
    });


    const dataApiKey = await responceApiKey.json();
    process.env.YG_API_KEY = dataApiKey[0].key
    return dataApiKey[0].key


  } catch (error) {
    console.error(`Api ключ не обнаружен, произошла ошибка ${error.code}`);
    return
  }
}




const getYGColums = async () => {
  try {

    const responce = await fetch(`${url}columns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.YG_API_KEY}`
      }
    })

    const data = await responce.json();
    return data

  } catch (error) {
    console.error(`Yougile колонки не обнаружены, произошла ошибка ${error.code}`);
    return
  }
}


await getYGApiKey()
const columns = await getYGColums()

const agreeColumn = columns.content.find((item) => item.title == 'Согласовано').id ?? null
const disagreeColumn = columns.content.find((item) => item.title == 'Отклонено').id ?? null







// tg
const bot = await getTelegramBot()
bot.getMe()
  .then((botInfo) => {
    console.log(`Бот подключен: @${botInfo.username}`)
  })
  .catch((error) => {
    console.error('Бот не подключился:', error)
  })

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message)
})

bot.on('error', (error) => {
  console.error('Bot error:', error)
})

// methods

const startBot = () => {
  bot.on("message", (msg) => {

    const chatId = msg.chat.id;
    const message = msg.text;

    if(message === '/start') {
      bot.sendMessage(chatId, "Привет, я бот для Telegram", {

        reply_markup: {
          resize_keyboard: true,
          keyboard: [
          [{ text: 'Помощь', callback_data: 'help' }, { text: 'О Боте', callback_data: 'about' }, { text: 'Карточки', callback_data: 'cards' }],
        ]}
      });
    }


    if(message === 'Помощь') {
      bot.sendMessage(chatId, "Вместе с карточкой вам дайтеся возможность ответить 3 ответами:\n\n1)Согласовать\n\n2)Отклонить\n\n3)Согласовать с замечаниями\n\nВ зависимости от ответа данная заявка попадает в аналогичную колонку в YouGile компании Prodcution UTV для дальнейшей обработки");
    } else if (message === 'О Боте') {
      bot.sendMessage(chatId, "Бот для работы с входящими заявками на производство продукции Production UTV");
    } else if (message === 'Карточки') {

      freeCard.map((item) => {
        bot.sendMessage(chatId, messageToTg(item), {
          reply_markup: {
            inline_keyboard: [
              [{text: 'Согласовать', callback_data: 'agree'}],
              [{text: 'Отклонить', callback_data: 'disagree'}],
              [{text: 'Согласовать с замечанием', callback_data: 'comment'}]
            ]
          }

      })})


    }
  });




}


const answerBotMessage = () => {
  bot.on("callback_query", async (msg) => {

    try {


    const chatId = msg.message.chat.id;
    const callbackData = msg.data;
    const text = msg.message.text;
    const messageId = msg.message.message_id


    const parseData = callbackData.split(':')
    const callbackText = parseData[0]
    const callbackId = parseData[1]
    const callbackCardId = parseData[2]


    if (callbackText === 'agreed') {

      const getCard = await getMessageYouGile(callbackId)

      if (!getCard || !getCard.success) {
        throw new Error('Ошибка получения задачи Yougile')
      }

      const moveCard = await moveMessageYouGile(callbackId, agreeColumn)

      console.log(`Задача ${getCard.data.title} перемещана во вкладку "Согласовано"`)

      const userId = getCard.data.description.match(/<strong>TelegramID<\/strong><br\s*\/?>([^<]*)<br\s*\/?>/)[1];

      // message

      const message = `*Задача ${getCard.data.title}\n\nСтатус - <b>Cогласовано</b>\nЗа дополнительной информацией обратитесь к менеджеру проекта\n\nДата изменения <b>${new Date().toLocaleDateString('ru-RU')}</b> - ${new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
      })}`

      // send to Group

      await bot.editMessageText(
        message,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "HTML",
        }
      );

      // send User


      await bot.sendMessage(userId, message, {parse_mode: 'HTML'});

      await prisma.message.update({
        where: {
          id: parseInt(callbackCardId)
        },
        data: {
          status: callbackText
        }
      })


    } else if (callbackText === 'disagreed') {

      const getCard = await getMessageYouGile(callbackId)

      if (!getCard || !getCard.success) {
        throw new Error('Ошибка получения задачи Yougile')
      }

      const moveCard = await moveMessageYouGile(callbackId, disagreeColumn)

      console.log(`Задача ${getCard.data.title} перемещана во вкладку "Не согласовано"`)

      const userId = getCard.data.description.match(/<strong>TelegramID<\/strong><br\s*\/?>([^<]*)<br\s*\/?>/)[1];

      // message

      const message = `*Задача ${getCard.data.title}\n\nСтатус - <b>Не согласовано</b>\nЗа дополнительной информацией обратитесь к менеджеру проекта\n\nДата изменения <b>${new Date().toLocaleDateString('ru-RU')}</b> - ${new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
      })}`

      // send to Group

      await bot.editMessageText(
        message,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "HTML",
        }
      );

      // send User


      await bot.sendMessage(userId, message, {parse_mode: 'HTML'});

      // 

      await prisma.message.update({
        where: {
          id: parseInt(callbackCardId)
        },
        data: {
          status: callbackText
        }
      })

    }



    } catch (error) {
      logger.error(`При попытке перенести сообщение в телеграм боте произошла ошибка ${error.message}`)
      console.error(`При попытке перенести сообщение в телеграм боте произошла ошибка ${error.message}`)
    }

  })

}




startBot()
answerBotMessage();

//

const backendStatic = path.resolve(process.cwd(), 'public')
const frontendStatic = path.resolve(process.cwd(), '../frontend/build')


// 


const app = express();
const pid = process.pid;

// use

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static paths

app.use(express.static(backendStatic));
app.use(express.static(frontendStatic))

// router

app.use('/api/v1', messageRouter);

// frontend static





const frontendPath = path.resolve(process.cwd(), '../frontend/build/index.html')


app.get('/', (req, res) => {

  if (!frontendPath) {
    res.status(404).json({
      message: 'Нет папки с фронтендом (сделайте сборку)'
    })
  }

  res.status(200).send(frontendPath)


})


// listen

const PORT = process.env.PORT || 9000;

const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info('Сервер запущен на порту 9000 и pid ' + pid + ' Добро пожаловать v3.2')
      console.log(`Сервер запущен на порту ${PORT} и pid ${pid} Добро пожаловать v3.2`);
    });


    server.on('error', (err) => {
      console.error(`ОШИБКА старта серевера ${err}`)
      process.exit(1)
    })

  } catch (error) {
    logger.error(`Сервер не запустился код ошибки ${error}`)
    console.error(`Сервер не запустился код ошибки ${error}`);
  }
};



startServer();
