import path from 'path'
import dotenv from 'dotenv'

// 

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

// 


export async function getYGSticker () {

    try {


        const url = process.env.YG_URL ?? null
        const key = process.env.YG_API_KEY ?? null


        console.log(key)


        const response = await fetch(`${url}/string-stickers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            }
        })

        const data = await response.json()
        return data
        
    } catch (error) {
        console.error(`Сообщение пользователю ${columnId} не отправлено ${error.message}`)
        return 
    }


}

