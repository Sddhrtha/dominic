const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

class db {

    #uri;
    #client;

    constructor() {
        this.#uri = process.env.MONGO_URI;
        try{
            console.log('Establishing database connection');
            const connection = new MongoClient(this.#uri);
            this.#client = connection.db("InventoryManagemet");
        }catch(error) {
            console.error(`An error occured while establishing database connection`);
        }
        
    }

    getClient = (collection) => this.#client.collection(collection);

}

module.exports = new db();