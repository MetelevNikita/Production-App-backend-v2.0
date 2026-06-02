export function SampleMessage (card) {


    const tg = `№<b>${card.id}</b>\n\n<b>Название проекта</b>\n\n${card.title}\n\n<b>Имя</b>\n\n${card.name}\n\n<b>Телефон</b>\n\n${card.phone}\n\n<b>TelegramID</b>\n\n${card.tgid}\n\n<b>Тип продукта</b>\n\n${card.typeproduct}\n\n<b>Другое</b>\n\n${card.otherproduct}\n\n<b>Сопутствующие продукты для фильма</b>\n\n${card.promotion}\n\n<b>Тип Работ</b>\n\n${card.typework}\n\n<b>Для какой большой цели нужен продукт?</b>\n\n${card.target}\n\n<b>Кто является конечным зрителем и география его проживания?</b>\n\n${card.viewer}\n\n<b>Какой эффект должен произвести продукт на зрителя?</b>\n\n${card.effect}\n\n<b>Опишите содержание ролика</b>\n\n${card.description}\n\n<b>Закадровый текст</b>\n\n${card.voiceover}\n\n<b>Хронометраж</b>\n\n${card.timing}\n\n<b>Площадки для размещения</b>\n\n${card.place}\n\n<b>Техническая спецификация</b>\n\n${card.technicalspecification}\n\n \n\n<b>Дата выхода</b>\n\n${new Date(card.deadline).toLocaleDateString('RU-ru')}\n\n<b>*Дата создания карточки пррграммой</b>\n\n${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru', {
        hour: "2-digit",
        minute: "2-digit"
    })}`
    

    const yg = `№<strong>${card.id}</strong><br><br><strong>Название проекта</strong><br>${card.title}<br><br><strong>Имя</strong><br>${card.name}<br><br><strong>Телефон</strong><br>${card.phone}<br><br><strong>TelegramID</strong><br>${card.tgid}<br><br><strong>Тип продукта</strong><br>${card.typeproduct}<br><br><strong>Другое</strong><br>${card.otherproduct}<br><br><strong>Сопутствующие продукты для фильма</strong><br>${card.promotion}<br><br><strong>Тип Работ</strong><br>${card.typework}<br><br><strong>Для какой большой цели нужен продукт?</strong><br>${card.target}<br><br><strong>Кто является конечным зрителем и география его проживания?</strong><br>${card.viewer}<br><br><strong>Какой эффект должен произвести продукт на зрителя?</strong><br>${card.effect}<br><br><strong>Опишите содержание ролика</strong><br>${card.description}<br><br><strong>Закадровый текст</strong><br>${card.voiceover}<br><br><strong>Хронометраж</strong><br>${card.timing}<br><br><strong>Площадки для размещения</strong><br>${card.place}<br><br><strong>Техническая спецификация</strong><br>${card.technicalspecification}<br><br><br><strong>Дата выхода</strong><br>${new Date(card.deadline).toLocaleDateString('RU-ru')}<br><br><strong>*Дата создания карточки пррграммой</strong><br><br>${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru', {
        hour: "2-digit",
        minute: "2-digit"
    })}`


    return {tg, yg}
}