const router = require('express').Router();
const productRouter = require('./products');
const orderRouter = require('./orders');
const contractorRouter = require('./contractors');
const userRouter = require('./users');
const verifyToken = require('./../middleware/authMiddleware');

router.use('/product',verifyToken, productRouter);
router.use('/order',verifyToken, orderRouter);
router.use('/contractor',verifyToken, contractorRouter);
router.use('/users', userRouter);




module.exports = router;