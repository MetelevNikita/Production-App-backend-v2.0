import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// module

import messageRouter from "./router/messageRouter.js";
import agreeRouter from "./router/agreeRouter.js";
import disagreeRouter from "./router/disagreeRouter.js";

// tg


const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

// methods

const startBot = () => {
  bot.on("message", (msg) => {
    console.log(msg);

    const chatId = msg.chat.id;
    const message = msg.text;

    if(message === '/start') {
      bot.sendMessage(chatId, "Привет, я бот для Telegram", {

        reply_markup: {
          resize_keyboard: true,
          keyboard: [
          [{ text: 'Помощь', callback_data: 'help' }, { text: 'О Боте', callback_data: 'about' }],
        ]}
      });
    }
  });

}

const infoBot = () => {
  bot.on("message", (msg) => {

    const chatId = msg.chat.id;
    const message = msg.text;

    if(message === 'Помощь') {
      bot.sendMessage(chatId, "Сделайте то то и то то");
    } else if (message === 'О Боте') {
      bot.sendMessage(chatId, "Бот бот бот бот");
    }
  });

}


const answerBotMessage = () => {
  bot.on("callback_query", (msg) => {
    const chatId = msg.message.chat.id;
    const message = msg.data;
    const text = msg.message.text;

    const id = text.split("\n")[0];
    console.log(id);


    if (message === 'agree') {

      bot.sendMessage(chatId, "Согласен");
      getSingleAgree(id)
      // deleteMessage(id);
      // bot.deleteMessage(chatId, msg.message.message_id);

    } else {

      bot.sendMessage(chatId, "Не согласен");
      getSingleDisagree(id)
      // deleteMessage(id);
      // bot.deleteMessage(chatId, msg.message.message_id);

    }

  })
}



startBot()
infoBot();
answerBotMessage();



//

const getSingleAgree = async (id) => {

  try {

    const responce = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })

    const singleMessage = await responce.json();
    console.log(singleMessage[0]);
    return postCard(singleMessage[0], 'agree')


  } catch (error) {
    console.log(error);
  }
}


const getSingleDisagree = async (id) => {

  try {

    const responce = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })

    const singleMessage = await responce.json();
    console.log(singleMessage[0]);
    return postCard(singleMessage[0], 'disagree')


  } catch (error) {
    console.log(error);
  }

}


// post


const postCard = async (card, link) => {
  try {
    const responce = await fetch(`http://localhost:9000/api/v1/${link}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card)
    })

    const data = await responce.json();
    return data

  } catch (error) {
    console.log(error);
  }
}


// delete


const deleteMessage = async (id) => {
  try {
    const responce = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    const data = await responce.json();
    console.log(data);
    return data

  } catch (error) {
    console.log(error);
  }
}






const app = express();
const pid = process.pid;

// use

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// router

app.use('/api/v1', messageRouter);
app.use('/api/v1', agreeRouter);
app.use('/api/v1', disagreeRouter);

// listen

const PORT = process.env.PORT || 9000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT} и pid ${pid}`);
    });
  } catch (error) {
    console.error(`Сервер не запустился код ошибки ${error}`);
  }
};

startServer();
