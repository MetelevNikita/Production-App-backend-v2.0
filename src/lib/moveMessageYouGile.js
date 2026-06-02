export async function moveMessageYouGile (cardId, newColumn) {
    try {

        const key = process.env.YG_API_KEY ?? null
        const url = process.env.YG_URL ?? null

        if (!key || !url) {
            throw new Error('Ошибка! не удалось получить ключ или url YouGile')
        }

        const response = await fetch(`${url}tasks/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                columnId: newColumn
            })
        })

        if (!response.ok) {
            throw new Error(`Ошибка! карточка ${cardId} не перемещена`)
        }


        const data = await response.json()
        return {
            success: true,
            message: `Карточка ${cardId} перемещена в новую колонку`,
            data: data.id
        }
        
    } catch (error) {
        console.error(`Сообщение пользователю ${cardId} не отправлено ${error.message}`)
        return {
            success: true,
            message: `Ошибка! ${cardId} не премещена`,
            data: data.id
        }
    }
}