const menu = {
    _id: {},
    NAME: {
        type: 'String',
        require: true,
        default: 'none',
        loc: "Название"
    },
    LINK: {
        type: 'String',
        require: false,
        default: 'none',
        loc: "Ссылка"
    }
};

export default menu;