export default function HeaderTag({ name }) 
{
    let headers = {
        menu: 'Меню',
        owners: 'Владельцы',
        services: 'Услуги',
        rating: 'Рейтинг',
        models: 'Модели',
    }

    return (
        <>{headers[name]}</>
    )
}