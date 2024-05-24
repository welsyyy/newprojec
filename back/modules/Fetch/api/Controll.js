import { DBRef, ObjectId } from "mongodb";
import schema from "../schema/index.js";

export default class Controll {

    constructor(collectionName = '') {
        if(collectionName == '')
            return;

        this.schema = schema[collectionName];
    }

    preparePost(query = {}) {
        let data = {};

        //Если есть данный атрибут, то это будет сигналом для обновления, если нет - для добавления
        if(query._id.length > 0) {
            data._id = new ObjectId(query._id);
        }

        if(Object.keys(query).length > 0 && Object.keys(this.schema).length > 0) {
            for (let i in this.schema) {
                if(i === '_id') continue;

                let checkElement = query[i];
                let checkSchema = this.schema[i];

                if(checkElement != '') {
                    switch(checkSchema.type) {
                        case 'Number':
                            data[i] = parseFloat(checkElement);
                        break;

                        default:
                        case 'String':
                            case 'Phone':
                                case 'Email':
                            data[i] = String(checkElement);
                        break;

                        case "Date":
                            let d = checkElement.split('.');
                            data[i] = new Date(d[2], d[1]-1, d[0]);
                        break;

                        case 'DBRef':
                            let value = new DBRef(checkSchema.collection, new ObjectId(checkElement));
                            data[i] = value;
                        break;
                    }
                }
                else {
                    data[i] = checkSchema.default;
                }
            }
        }

        return data;
    }

    static prepareData(data = [], schema = {}) {
        let result = [];

        if(data instanceof Array && Object.keys(schema).length > 0) {
            data.forEach(item => {
                let newRow = {};

                for(let fieldName in schema) {
                    let fieldSchema = schema[fieldName];
                    let newData = (item[fieldName]) ? item[fieldName] : fieldSchema.default;
                    if(fieldSchema.type === 'DBRef') {
                        let dbref = item[fieldName];
                        if(dbref && dbref.collection) {
                            newRow[fieldName] = {
                                ref: true,
                                collectionName: dbref.collection,
                                _id: String(dbref.oid)
                            }
                        }
                        
                    }
                    else {
                        newRow[fieldName] = newData;
                    }
                }
                result.push(newRow);
            });
        }

        return result;
    }
}