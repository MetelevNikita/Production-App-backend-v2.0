import { pool } from '../database/db.js'
import dotenv from 'dotenv'
import path from 'path'

// 

import { sendMessageTelegram } from '../lib/sendMessageTg.js'
import { sendMessageYougile } from '../lib/sendMessageYouGile.js'

// 

import { SampleMessage } from '../data/messages.js' 

// 

import {prisma} from '../lib/prisma.js'


dotenv.config({
  path: path.join(process.cwd(), '.env')
})

// lib yg

const getYGColums = async () => {
  try {


    const url = process.env.YG_URL || ''

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
    console.log(`Yougile колонки не обнаружены, произошла ошибка ${error.code}`);
    return
  }
}


// 





const getMessage = async (req, res) => {
  try {

    const messages = await prisma.message.findMany()

    if (!messages || messages.length < 1) {
      res.status(200).json({
          success: false,
          message: `Сообщение не получены или пусты`,
          data: []
      })
      return
    }

      res.status(200).json({
        success: false,
        message: 'Сообщения получены',
        data: messages
      })

  } catch (error) {
    console.error(error)
    res.status(200).json({
        success: false,
        message: `Сообщение не получены ${(error.message) ? error.message : error}`,
        data: []
    })
  }
}


const getSingleMessage = async (req, res) => {
  try {

    const { id } = req.params
    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!message) {
      res.status(200).json({
        success: false,
        message: 'Сообщение не получены',
        data: []
      })
      return
    }

    res.status(200).json({
      success: false,
      message: 'Сообщение не получены',
      data: message
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
        success: false,
        message: 'Сообщения не получены',
        data: null
    })

  }
}


const postMessage = async (req, res) => {
  try {

    const {title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body
    const data = req.body

    // 

  

    // 

    const columns = await getYGColums()
    const inboxColumn = columns.content.find(item => item.title == 'Входящие') ?? null

    if (!inboxColumn || !columns) {
      res.status(200).json({
            success: false,
            message: 'Не удалось получить данные с YouGile',
            data: null
      })
    }



    const newMessage = await prisma.message.create({
      data: {
          ...data,
          status: 'inbox'
        }
    })

    console.log(newMessage)

    if (!newMessage) {
      res.status(200).json({
        success: false,
        message: 'Сообщение не создано',
        data: null
      })
    }

    const messages = SampleMessage(newMessage)

    const sendToYG = await sendMessageYougile(title, inboxColumn.id, messages.yg, deadline, name)
    console.log(sendToYG)

    // 

    const sendToTgAuthor = await sendMessageTelegram(tgid, 'author', messages.tg, '', '')
    console.log('SEND TO AUTHOR ', sendToTgAuthor)

    const sendToTgGroup = await sendMessageTelegram('-4171897222', 'admin', messages.tg, sendToYG.id, newMessage.id)
    console.log('SEND TO ADMIN GROUP ', sendToTgGroup)



    res.status(200).json({
      success: true,
      message: 'Сообщение создано',
      data: newMessage
    })


  } catch (error) {
    console.error(error)
    res.status(500).json({message: `ERROR ${error.message}`})
    return


  }
}


const deleteMessage = async (req, res) => {
    try {

    const { id } = req.params

    console.log(id)

    const deleteMessage = await prisma.message.delete({
      where: {
        id: parseInt(id)
      }
    })

    if (!deleteMessage) {
      res.status(200).json({
          success: false,
          message: `Сообщение ${id} не удалено`,
          data: []
      })
    }

    res.status(200).json({
        success: false,
        message: `Сообщение ${id} удалено`,
        data: deleteMessage
    })


  } catch (error) {
    console.error(error)
    res.status(200).json({
        success: false,
        message: `Сообщение не удалено ${(error.message) ? error.message : error}`,
        data: []
    })

  }
}


const updateMessage = async (req, res) => {
  try {

    const { id } = req.params
    const { status } = req.body


    const updateMessage = await prisma.message.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status: status
      }
    })

    if (!updateMessage) {
      res.status(200).json({
          success: false,
          message: `Статус ${id} не изменен`,
          data: []
      })
    }


    res.status(200).json({
        success: false,
        message: `Статус ${id} изменен`,
        data: []
    })




  } catch (error) {
    console.error(error)

}

}






export { getMessage, getSingleMessage, postMessage, deleteMessage, updateMessage }


