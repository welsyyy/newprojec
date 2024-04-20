const services = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Наименование услуги",
        sort: true,
        editable: true,
    },
    DATE: {
        type: 'Date',
        require: true,
        default: 'None',
        loc: "Дата оказания",
        sort: true,
        editable: true,
    },
    CARD: {
        type: 'DBRef',
        require: false,
        default: 'None',
        loc: "Автомобиль",
        sort: true,
        editable: true,
        collection: 'cards'
    },
    PRICE: {
        type: 'Number',
        require: true,
        default: 0,
        loc: "Цена за ед.",
        sort: true,
        editable: true,
        step: 10,
        sim: 'TOTAL'
    },
    COUNT: {
        type: 'Number',
        require: true,
        default: 0,
        loc: "Кол-во",
        sort: true,
        editable: true,
        step: 1,
        sim: 'TOTAL'
    },
    TOTAL: {
        type: 'Number',
        require: false,
        default: 0,
        loc: "Сумма",
        sort: true,
        editable: true,
        readOnly: true,
        method: 'MULTIPLY',
        fields: [ 'PRICE', 'COUNT' ],
        mask: '#VAL1# * #VAL2#'
    },
}

export default services;