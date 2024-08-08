import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage('./scratch');

dotenv.config();

// module

import messageRouter from "./router/messageRouter.js";
import agreeRouter from "./router/agreeRouter.js";
import disagreeRouter from "./router/disagreeRouter.js";
import commentRouter from "./router/commentRouter.js";


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


    const responceApiKey = await fetch(`${url}auth/keys/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({login: 'Kyle.B@mail.ru', password: 'Metelev1989', companyId: dataCompany.content[3].id})
    });


    const dataApiKey = await responceApiKey.json();
    localStorage.setItem('apiKey', dataApiKey[0].key)


  } catch (error) {
    console.log(`Api ключ не обнаружен, произошла ошибка ${error.code}`);
  }
}



const apiKey = localStorage.getItem('apiKey');



const getYGColums = async () => {
  try {

    const responce = await fetch(`${url}columns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    const data = await responce.json();
    localStorage.setItem('columnAgree', data.content[1].id)
    localStorage.setItem('columnDisagree', data.content[2].id)
    localStorage.setItem('columnComment', data.content[8].id)

  } catch (error) {
    console.log(`Yougile колонки не обнаружены, произошла ошибка ${error.code}`);
  }
}


const getYGtask = async () => {
  try {

    const responce = await fetch(`${url}tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    const data = await responce.json();

  } catch (error) {
    console.log(`Yougile задач не обнаружены, произошла ошибка ${error.code}`);
  }
}


getYGApiKey()
getYGColums()


const agreeColumn = localStorage.getItem('columnAgree');
const disagreeColumn = localStorage.getItem('columnDisagree');
const commentColumn = localStorage.getItem('columnComment');



const yougileСoordinationColumn = async (id, column) => {

  try {

    const responce = await fetch(`${url}tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({deleted: false, columnId: column})

    })

  } catch (error) {
    console.log(`задача не обнаружена, произошла ошибка ${error.code}`);
  }
}



// tg


const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const messageToTg = (card) => {
  return `№${card.id}\n\nНазвание проекта\n\n${card.title}\n\nИмя\n\n${card.name}\n\nТелефон\n\n${card.phone}\n\nTelegramID\n\n${card.tgid}\n\nТип продукта\n\n${card.typeproduct}\n\nДругое\n\n${card.otherproduct}\n\nСопутствующие продукты для фильма\n\n${card.promotion}\n\nТип Работ\n\n${card.typework}\n\nДля какой большой цели нужен продукт?\n\n${card.target}\n\nКто является конечным зрителем и география его проживания?\n\n${card.viewer}\n\nКакой эффект должен произвести продукт на зрителя?\n\n${card.effect}\n\nОпишите содержание ролика\n\n${card.description}\n\nЗакадровый текст\n\n${card.voiceover}\n\nХронометраж\n\n${card.timing}\n\nПлощадки для размещения\n\n${card.place}\n\nТехническая спецификация\n\n${card.technicalspecification}\n\n \n\nДата выхода\n\n${card.deadline}`
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


    const userTgId = text.split("\n")[19]
    const id = text.split("\n")[0].slice(1, 5);
    const cardId = msg.message.text.split("\n")[3].slice(1, -1)


    let textToUser = ''


    if(message === 'agree') {
      textToUser = `*Ваше сообщение за номером ${id} помечено как согласованное, за дополнительной информацией обратитесь к менеджеру проекта*`
    } else if (message === 'disagree') {
      textToUser === `*Ваше сообщение за номером ${id} помечено как отклоненное, за дополнительной информацией обратитесь к менеджеру проекта*`
    } else if (message === 'comment') {
      textToUser = `*Ваше сообщение за номером ${id} помечено как согласованное с замечанием, за дополнительной информацией обратитесь к менеджеру проекта*`
    }





    if (message === 'agree') {

      bot.sendMessage(chatId, `Задача с №${id} согласована!`);
      getUpdateMessage(id)
      yougileСoordinationColumn(cardId, agreeColumn)

      sendMessageTgUser(userTgId, textToUser)

      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message.message_id);
        getSingleAgree(id)
      }, 2000);

    } else if (message === 'disagree') {

      bot.sendMessage(chatId, `Задача с №${id} согласована!`);
      getSingleDisagree(id)
      sendMessageTgUser(userTgId, textToUser)
      yougileСoordinationColumn(cardId, disagreeColumn)
      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message.message_id);
      }, 2000);


    } else if (message === 'comment') {

      bot.editMessageText(text + `\n\n*Сообщение согласовано с замечанием, просьба связаться с О.Н*`, {
        chat_id: chatId,
        message_id: msg.message.message_id,
        parse_mode: 'Markdown',
      })
      sendMessageTgUser(userTgId, textToUser)

      getUpdateMessage(id)
      yougileСoordinationColumn(cardId, commentColumn)
      setTimeout(() => {
        getSingleComment(id)
      }, 2000)
    }

    } catch (error) {
      console.error(error)
    }

  })

}



const sendMessageTgUser = async (chat_id, text) => {
  try {

    const ANSWER_BOT_TOKEN = process.env.ANSWER_BOT_TOKEN
    const url = `https://api.telegram.org/bot${ANSWER_BOT_TOKEN}/sendMessage`


    const responce = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({chat_id: chat_id, parse_mode: 'html', text: text})
    })

  } catch (error) {
    console.error(`При отправке обратного сообщения пользователю произошла ошибка ${error}`)
  }
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
      return freeCard.push(item);
    })



  } catch (error) {
    console.log(error);
  }
}

getAllCard()





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
    console.log(singleMessage[0])
    return postCard(singleMessage[0], 'disagree')


  } catch (error) {
    console.log(error);
  }

}


const getUpdateMessage = async (idCard) => {
  try {

    const responceCard = await fetch(`http://localhost:9000/api/v1/message/${idCard}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })

    const singleMessage = await responceCard.json();
    console.log(singleMessage[0]);

    const {id, title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = singleMessage[0];

    const responce = await fetch(`http://localhost:9000/api/v1/message/${idCard}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",

      },

      body: JSON.stringify({
          id: id,
          cardid: cardid,
          title: title,
          name: name,
          phone: phone,
          tgid: tgid,
          typeproduct: typeproduct,
          otherproduct: otherproduct,
          promotion: promotion,
          typework: typework,
          target: target,
          viewer: viewer,
          effect: effect,
          description: description,
          voiceover: voiceover,
          timing: timing,
          place: place,
          technicalspecification: technicalspecification,
          deadline: deadline,
          comment: "Сообщение согласовано"

      })
    })

    const data = await responce.json();
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
      console.log(`Сервер запущен на порту ${PORT} и pid ${pid} Добро пожаловать`);
    });
  } catch (error) {
    console.error(`Сервер не запустился код ошибки ${error}`);
  }
};

startServer();
