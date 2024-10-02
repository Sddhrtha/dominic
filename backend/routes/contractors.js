const router = require('express').Router();
const db = require('./../config/db');
const { ObjectId} = require('mongodb');


const contractor = db.getClient('contractor');

router.get('/', async (req, res, next) => {
    try {
        const documents = await contractor.find({}).toArray();
        res.send(documents);
    }catch(error) {
        console.error(`An error occured while fetching all products info.`, error);
    }
});


router.post('/add', async (req, res, next) => {
    try {
        const document = req.body;
        console.log(document);
        await contractor.insertOne(document);
        res.send({ code: 200, message: 'success'})
    }catch(error) {
        console.error(`An error occured while adding a document to the collection`);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const documentId = req.params.id;
        const document = await contractor.findOne({ _id: new ObjectId(documentId)});
        res.send(document);
    }catch(error) {
        console.error(`An error occured while fetching document.`, error);
    }
} );


router.delete(('/:id'), async (req, res, next) => {
    try {
        const response = await contractor.deleteOne({ _id: new ObjectId(req.params.id)});
        res.send({ code: 200, message: 'Success'});
    }catch (error) {
        console.error(`An error occured while deleting a document.`, error);
    }
})



module.exports = router;