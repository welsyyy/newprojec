const models = {
    _id: {},
    GAME: {
        type: 'DBRef',
        require: true,
        default: 'none',
        loc: "Игра",
        sort: true,
        editable: true,
        collection: 'game'
    },
    TITLE: {
        type: 'String',
        require: true,
        default: 'none',
        loc: "Название",
        sort: true,
        editable: true
    },
    
};

export default models;