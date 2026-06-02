import { getTelegramBot } from "./telegramBot.js";


export async function sendMessageTelegram (id, type, message, callbackData = '', cardId = '') {

    try {
        
        const bot = await getTelegramBot()
        

        if (type === 'admin') {
                let resultMessage = bot.sendMessage(id, message, {
                        reply_markup: {
                        inline_keyboard: [
                        [
                            {
                            text: "Согласовать",
                            callback_data: `agreed:${callbackData}:${cardId}`,
                            },
                        ],
                        [
                            {
                            text: "Отклонить",
                            callback_data: `disagreed:${callbackData}:${cardId}`,
                            },
                        ],
                        ],
                    },
                        parse_mode: 'html'
                })
                return resultMessage

        } else {
            let resultMessage = bot.sendMessage(id, message, {parse_mode: 'html'})
            return resultMessage
        }


    } catch (error) {
        console.error(`Сообщение пользователю ${id} не отправлено ${error.message}`)
        return 
    }
}