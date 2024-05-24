const rating = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'none',
        loc: 'Автор',
        sort: true,
        editable: true,
        searchable: false
    },
    GAME: {
        type: 'DBRef',
        require: true,
        default: 'none',
        loc: "Игра",
        sort: true,
        editable: true,
        collection: 'game'
    },
    PLOT: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: 'Сюжет',
        sort: true,
        editable: true,
        searchable: false
    },
    GRAPHIC: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: 'Графика',
        sort: true,
        editable: true,
        searchable: false
    },
    DETAILING: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: 'Детализация',
        sort: true,
        editable: true,
        searchable: false
    },
    LINK: {
        type: 'String',
        require: true,
        default: 'none',
        loc: 'Ссылка на YouTube',
        sort: true,
        editable: true,
        searchable: false
    }
};

export default rating;