const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');





router.use('/users', userRoutes);   // This is the api folder in the routes folder
router.use('/thoughts', thoughtRoutes); // This is the api folder in the routes folder






module.exports = router; // This is the api folder in the routes folder 
