const game = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'none',
        loc: "Название",
        sort: true,
        editable: true,
        searchable: true,
    },
    DATE: {
        type: 'Date',
        require: true,
        default: 'none',
        loc: "Дата анонса",
        sort: true,
        editable: true,
        filter: true
    },
    PUBLISHER: {
        type: 'String',
        require: false,
        default: 'none',
        loc: "Издатель",
        sort: true,
        editable: true,
        searchable: true,
    },
    GENRE: {
        type: 'String',
        require: false,
        default: 'none',
        loc: "Жанр",
        sort: true,
        editable: true,
        searchable: true,
    },
};

export default game;