const brands = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Название",
        sort: true,
        editable: true,
        searchable: true,
    },
    PARENT_COMPANY: {
        type: 'String',
        require: false,
        default: 'None',
        loc: "Владеющая компания",
        sort: true,
        editable: true,
        searchable: true,
    },
    COUNTRY: {
        type: 'String',
        require: false,
        default: 'None',
        loc: "Страна",
        sort: true,
        editable: true,
        searchable: true,
    },
    BUDGET: {
        type: 'Number',
        require: true,
        default: 0,
        loc: "Годовой бюджет ($)",
        sort: true,
        editable: true,
        filter: true,
        step: 100000
    }
}

export default brands;