const router = require('express').Router();
const usersDb = require('../config/db').getClient('users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20m"});
        return token;
    }catch(error) {
        console.error('An error occured while generating token', error);
    }
}


router.use('/register', async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        await usersDb.insertOne({ email, password: passwordHash, role});
        res.send({code: 200, message: 'success'});
    } catch(error) {
        console.error('An error occured while registering user.', error);
    }
});

router.use('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await usersDb.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({error: 'Authentication Failed'});
        }
        
        res.status(200).json({user: user._id, email: user.email , token: generateToken({ id: user._id}), role: user.role});

    } catch(error) {
        console.error('An error occured while loggin in user.', error);
    }
})

module.exports = router;