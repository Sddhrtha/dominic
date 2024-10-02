const router = require('express').Router();
const db = require('./../config/db');
const { ObjectId} = require('mongodb');


const order = db.getClient('order');

router.get('/', async (req, res, next) => {
    try {
        const documents = await order.find({}).toArray();
        res.send(documents);
    }catch(error) {
        console.error(`An error occured while fetching all products info.`, error);
    }
});


router.post('/place-order', async (req, res, next) => {
    try {
        const document = req.body;
        document['delivery_status'] = 0;
        document['status'] = 'Pending';
        await order.insertOne(document);
        res.send({ code: 200, message: 'success'})
    }catch(error) {
        console.error(`An error occured while adding a document to the collection`);
    }
});

router.post('/process-order', async (req, res, next) => {
    try {
        console.log(req.body);
        const { id, status } = req.body;
        await order.updateOne({ _id : new ObjectId(id)}, { $set: { status}});
        res.status(200).json({ message: 'order processed successfully.'});
    }catch (error) {
        console.error(`An error occured while processing order.`, error);
    }
});

router.post('/update-delivery', async (req, res, next) => {
    try {
        console.log(req.body);
        const { id, status } = req.body;
        await order.updateOne({ _id : new ObjectId(id)}, { $set: { delivery_status: status}});
        res.status(200).json({ message: 'order processed successfully.'});
    }catch (error) {
        console.error(`An error occured while processing order.`, error);
    }
});

router.get('/contractor-orders/:id', async (req, res, next) => {
    try {
        const contractorId = req.params.id;
        const documents = await order.find({ contractor_id: contractorId}).toArray();
        res.send(documents);
    }catch(error) {
        console.error(`An error occured while fetching contractor orders`);
    }
})

router.get('/get-order-details/:id', async (req, res, next) => {
    try {
        const documentId = req.params.id;
        const document = await order.findOne({ _id: new ObjectId(documentId)});
        res.send(document);
    }catch(error) {
        console.error(`An error occured while fetching document.`, error);
    }
} );


router.delete(('/delete-order/:id'), async (req, res, next) => {
    try {
        const response = await order.deleteOne({ _id: new ObjectId(req.params.id)});
        res.send({ code: 200, message: 'Success'});
    }catch (error) {
        console.error(`An error occured while deleting a document.`, error);
    }
})



module.exports = router;