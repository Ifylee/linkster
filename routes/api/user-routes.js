const router = require('express').Router();
const { User, Thought } = require('../../models');  

// api/user-routes

// Gets all users
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.find().select('-__v');
        return res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});  

// Creates a new user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create(req.body);
        res.status(201).json(dbUserData); 
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Gets a user by userId
router.get('/:userId', async (req, res) => {
    try {
        const dbUserData = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends');
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Updates a user by userId
router.put('/:userId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Deletes a user by userId
router.delete('/:userId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        // Delete associated thoughts if any
        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

        res.status(200).json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Adds a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Deletes a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } }, 
            { new: true } // Return the updated user data
        );
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json({ message: 'Friend deleted!', user: dbUserData }); // Return updated user data
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;
