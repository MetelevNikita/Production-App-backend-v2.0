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
import commentRouter from "./router/commentRouter.js";

// tg


const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const messageToTg = (item) => {
  return `\n${item.id}\n\n КАРТОЧКА #${item.id}\n\n\nАвтор:${item.name}\n\nСообщение:${item.text}`
}

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
          [{ text: 'Помощь', callback_data: 'help' }, { text: 'О Боте', callback_data: 'about' }, { text: 'Карточки', callback_data: 'cards' }],
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
  bot.on("callback_query", (msg) => {

    try {


    const chatId = msg.message.chat.id;
    const message = msg.data;
    const text = msg.message.text;

    const id = text.split("\n")[0];
    console.log(id);


    if (message === 'agree') {

      bot.sendMessage(chatId, "Согласен");
      getSingleAgree(id)
      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message.message_id);
      }, 2000);

    } else if (message === 'disagree') {

      bot.sendMessage(chatId, "Не согласен");
      getSingleDisagree(id)

      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message.message_id);
      }, 2000);


    } else if (message === 'comment') {

      bot.editMessageText(text + `\n\n*Сообщение согласовано с замечанием, просьба связаться с О.Н*`, {
        chat_id: chatId,
        message_id: msg.message.message_id,
        parse_mode: 'Markdown',
      })

      getUpdateMessage(id)
      setTimeout(() => {
        getSingleComment(id)
      }, 2000)


    }

    } catch (error) {
      console.error(error)
    }

  })

}


startBot()
infoBot();
answerBotMessage();

//


const freeCard = []


const getAllCard = async () => {
  try {

    const responce = await fetch(`http://localhost:9000/api/v1/message`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }

    })


    const data = await responce.json();
    return data.filter(card => card.comment === null).map((item) => {
      console.log(item);
      return freeCard.push(item);
    })



  } catch (error) {
    console.log(error);
  }
}


getAllCard()

setTimeout(() => {
  console.log(freeCard)
}, 3000)








//

const getSingleAgree = async (id) => {

  try {


    console.log(id);

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


const getUpdateMessage = async (id) => {
  try {

    const responceCard = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })

    const singleMessage = await responceCard.json();
    console.log(singleMessage[0]);

    const { name, text, date, comment } = singleMessage[0];

    const responce = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",

      },

      body: JSON.stringify({
        id: id,
        name: name,
        text: text,
        date: date,
        comment: 'Сообщение согласовано!!!',

      })
    })

    const data = await responce.json();
    console.log(data);
    return data

  } catch (error) {
    console.log(error);

  }
}


const getSingleComment = async (id) => {
  try {

    const responce = await fetch(`http://localhost:9000/api/v1/message/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })


    const singleMessage = await responce.json();
    console.log(singleMessage[0]);
    return postCard(singleMessage[0], 'comment')


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
app.use('/api/v1', commentRouter)

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
