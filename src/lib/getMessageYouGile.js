export async function getMessageYouGile (cardId) {
    try {

        const key = process.env.YG_API_KEY ?? null
        const url = process.env.YG_URL ?? null

        if (!key || !url) {
            throw new Error('Ошибка! не удалось получить ключ или url YouGile')
        }

        const response = await fetch(`${url}tasks/${cardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            }
        })

        if (!response.ok) {
            throw new Error(`Ошибка! карточка ${cardId} не получена`)
        }


        const data = await response.json()
        return {
            success: true,
            message: `Карточка ${cardId} получена`,
            data: data
        }
        
    } catch (error) {
        console.error(`Сообщение пользователю ${cardId} не отправлено ${error.message}`)
        return {
            success: true,
            message: `Ошибка! карточка ${cardId} не получена ${error.message}`,
            data: null
        }
    }
}