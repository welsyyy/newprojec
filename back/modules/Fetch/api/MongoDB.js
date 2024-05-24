import { MongoClient, ObjectId } from 'mongodb';
import Schema from '../schema/index.js';
import Controll from './Controll.js';

export default class MongoDB {
    static #DBNAME = "starsgames"; //имя базы
    static #LOCATION = "mongodb://localhost"; //127.0.0.1
    static #PORT = 27017; //порт
    static #LOGIN; //логин
    static #PSSWD; //пароль

    constructor(collectionName = '') {
        console.log('start DB connect');
        const url = [MongoDB.#LOCATION, MongoDB.#PORT].join(":") + '/'; //mongodb://localhost:12017
        this.client = new MongoClient(url);
        this.db = this.client.db(MongoDB.#DBNAME);

        if(collectionName != '') {
            this.collection = this.db.collection(collectionName);
            this.schema = Schema[collectionName];
            this.controll = new Controll(collectionName);
        }
        
        console.log('DB connect');
    }

    async getCountElements(collectionName) {
        try {
            if(collectionName != '') {
                const collection = this.db.collection(collectionName);
                const count = await collection.countDocuments();
                return count;
            }
            else {
                return 0;
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    static issetCollection(collectionName) {
        this.Init();
        let result = false;
        if(collectionName != "") {
            result = (this.db[collectionName]);
        }
        this.mongoClient.close();
        return result;
    }
    
    static createCollection(collectionName) {
        if(collectionName === "")
            return false;

        let isset = this.issetCollection(collectionName);
        if(!isset) {
            this.initDb();
            let collection = this.db.createCollection(collectionName);
            this.mongoClient.close();
            return collection; // {ok : 1}
        }

        return false;
    }

    async setValue(props = {}) {
        if(!this.collection)
            return {};

        let id = 0;
        let controllData = this.controll.preparePost(props);

        if(controllData._id) {
            //UPDATE
            id = await this.collection.updateOne({ _id : controllData._id }, { $set: controllData });
        }
        else {
            //ADD
            id = await this.collection.insertOne(controllData);
        }

        //let id = await this.collection.insertOne(props); //db.collectionName
        return id;
    }

    async removeValue(id) {
        if(!this.collection)
            return {};
        await this.collection.deleteOne({_id : new ObjectId(id)});
    }

    static getCount(collectionName) {
        this.Init();
        let result = 0;
        if(collectionName != "") {
            result = this.db[collectionName].count();
        }
        this.mongoClient.close();
        return result;
    }

    async getValue(options = {}) {
        if(!this.collection)
            return {};
        
        let filter = options.filter ? options.filter : {};

        if(options.search && options.search.length > 2) {
            let arLine = options.search.split(' ').join('|');
            let query = new RegExp(arLine);
            let xor = [];

            for(let index in this.schema) {
                let item = this.schema[index];

                if(item.searchable) {
                    let el = {};
                    el[index] = { $regex : query, $options: 'i' };
                    xor.push(el);
                }
            }

            filter = {
                $or: [...xor]
            }
        }

        if(options.sort) {
            if(options.sort.max) {
                options.sort.key = -1;
                options.sort.name = options.sort.max;
                options.sort.limit = 1;
            }

            if(options.sort.min) {
                options.sort.key = 1;
                options.sort.name = options.sort.min;
                options.sort.limit = 1;
            }

            if(options.sort.field && options.sort.order) {
                options.sort.key = (options.sort.order === 'ASC') ? 1 : -1;
                options.sort.name = options.sort.field;
                options.sort.limit = 100;
            }
        }

        if(options.filter.filter === 'Y') {
            filter = {};

            for(let i in options.filter) {
                let el = options.filter[i];
                let from, to;

                if(i === 'filter')
                    continue;

                switch(this.schema[i].type) {
                    case "Number":
                        from = parseInt(el.FROM);
                        to = parseInt(el.TO);
                    break;

                    case 'Date':
                        from = new Date(el.FROM);
                        to = new Date(el.TO);
                    break;
                }

                filter[i] = { $gte: from , $lte : to}
            }
        }

        let unPreparedData;

        if(options.sort && options.sort.key) {
            let sort = {};
            sort[options.sort.name] = options.sort.key;
            unPreparedData = await this.collection.find().sort(sort).limit(options.sort.limit).toArray();
        }
        else {
            unPreparedData = await this.collection.find(filter).toArray();
        }

        let data = Controll.prepareData(unPreparedData, this.schema);
        let simId = {};
        let sim = {};

        data.forEach(item => {
            for(let i in item) {
                let keyElement = item[i];

                if(keyElement.ref) {
                    if(!simId[keyElement.collectionName])
                        simId[keyElement.collectionName] = [];

                    simId[keyElement.collectionName].push(new ObjectId(keyElement._id));
                }
            }
        });

        if(Object.keys(simId).length > 0) {
            for(let collection in simId) {
                let mdb = new MongoDB(collection);
                let ids = simId[collection];

                sim[collection] = await mdb.collection.find({
                    _id: { $in : ids }
                }).toArray();
            }
        }

        return {
            head: this.schema,
            data: data,
            sim: sim
        };
    }

    async getByIds(ar = []) {

    }

    async getOne(filter = {}) {
        if(!this.collection)
            return {};
        return await this.collection.findOne(filter);
    }

    static isJson(value) {
        try {
            JSON.parse(value);
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Отложенный сбор информации о всех коллекциях
     * @returns 
     */
    async getCollectionsStats() { //перечень имен коллекций
        let result = [];
        let sources = await this.db.listCollections().toArray();

        for (const source of sources) {
            const mdb = new MongoDB(source.name);
            const data = await mdb.getCollectionInfo();
            result.push(data);
        }

        return result;
    }

    /**
     * Отложенный сбор информации одной коллекции
     * @returns 
     */
    async getCollectionInfo() {
        let _this = this;

        return new Promise(async resolve => {
            resolve({
                TITLE: _this.collection.namespace,
                INDEXES: (await _this.collection.indexes()).length,
                DOCUMENTS: await _this.collection.countDocuments()
            });
        });
    }
}