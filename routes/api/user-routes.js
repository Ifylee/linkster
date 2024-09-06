const router = require('express').Router();
const { User, Thought } = require('../../models');  


// api/user-routes
// gets all users
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.find().select('-__v');
        return res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
   });  
// createsa new user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})



// gets a user by userId
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


router.delete('/:userId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

         res.status(200).json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


// api/user-routes/:userId/friends/:friendId
// adds a new friend to a user's friend list
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


router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.status(200).json({ message: 'Friend deleted!' });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;