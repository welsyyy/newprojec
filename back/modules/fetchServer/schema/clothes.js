const clothes = {
    _id: {},
    
        TITLE: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Название предмета",
            sort: true,
            editable: true,
            searchable: true,
            //list: []
        },
        PRICE: {
            type: 'String',
            require: true,
            default: 0,
            loc: "Цена",
            sort: true,
            editable: true,
            step: 100,
            filter: true,
        },
        COUNTRY: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Страна производства",
            sort: true,
            editable: true,
            searchable: true,
        }
    };

    export default clothes;
