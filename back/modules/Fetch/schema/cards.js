const models = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Гос.знак",
        sort: true,
        editable: true,
    },
    MODEL: {
        type: 'DBRef',
        require: true,
        default: 0,
        loc: "Модель",
        sort: true,
        editable: true,
        collection: 'models'
    },
    OWNER: {
        type: 'DBRef',
        require: true,
        default: 0,
        loc: "Владелец",
        sort: true,
        editable: true,
        collection: 'owners'
    },
    
}

export default models;