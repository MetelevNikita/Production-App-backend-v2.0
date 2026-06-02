import TelegramBot from "node-telegram-bot-api";
import { SocksProxyAgent } from "socks-proxy-agent";

// 

import path from 'path'
import dotenv from 'dotenv'

// 

dotenv.config({
    path: path.join(process.cwd(), '.env')
})


export async function getTelegramBot () {

    const TOKEN = process.env.BOT_TOKEN ?? null
    const SOCKS5h = process.env.SOCKS_AGENT ?? null

    const agent = new SocksProxyAgent(SOCKS5h) ?? null

    if (!TOKEN || !SOCKS5h) {
        throw new Error('Нет необходимых параметров')
    }


    if (!globalThis.telegramBot) {
        console.log('Нет клобального объекта телеграм бота')
        globalThis.telegramBot = new TelegramBot(TOKEN, {
            polling: true,
            ...(SOCKS5h
                ? {
                    request: {
                    agent: new SocksProxyAgent(SOCKS5h),
                    },
                }
                : {}),
            });

    }


    return globalThis.telegramBot


}