import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

export async function sendMessageYougile (title, columnId, description, deadline, name) {
    try {


        const timestamp = new Date(deadline).getTime()
        const url = process.env.YG_URL || ''
        const key = process.env.YG_API_KEY || ''


        const response = await fetch(`${url}tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                title: title,
                columnId: columnId,
                description: description,
                deadline: {deadline: timestamp},
                stickers: {[process.env.YG_AUTHOR_STEICKER]: name}
            })
        })

        if (!response.ok) {
            throw new Error(`Ошибка при создании задачи в YouGile ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        return data
        
    } catch (error) {
        console.error(`Сообщение пользователю ${columnId} не отправлено ${error.message}`)
        return 
    }
}