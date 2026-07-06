export async function putMessageYouGile (cardId, textComment, title, description) {
  try {

    const key = process.env.YG_API_KEY ?? null
    const url = process.env.YG_URL ?? null


      if (!key || !url) {
      console.error('Не получены данные активации Yougile (key или url)')
      return {
        success: false,
        message: 'Не получены данные активации Yougile (key или url)',
        data: null
      }
    }



    if (!cardId || cardId.length < 1) {
      console.error('Не получен id карточяки yougile')
      return {
        success: false,
        message: 'Не получен id карточяки yougile',
        data: null
      }
    }



    const response = await fetch(`${url}/tasks/${cardId}`, {
      method: 'PUT',
      headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        title: title,
        description: `${description}<br><br>Комментарий от О.Н Эделевой - ${textComment}<br><br>Дата измененеия - ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString()}`,
      })
    })


    if (!response.ok) {
      throw new Error(
        `Ошибка изменения карточки ${response.status} - ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log(`Статус иземения карточки ${data}`)
    return data


    
  } catch (error) {
        console.error(`Ошибка изменения карточки ${cardId} - ${error.message}`)
        return {
            success: true,
            message: `Ошибка! карточка ${cardId} не изменена ${error.message}`,
            data: null
        }
    }
}