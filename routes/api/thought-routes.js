const router = require('express').Router();
const { User, Thought } = require('../../models');



// api thought-routes
router.get('/', async (req, res) => {
    try {
        const dbThoughtData = await Thought.find().sort({ createdAt: -1 });
        return res.status(200).json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }  
});


router.post('/', async (req, res) => {
    try {
        const dbThoughtData = await Thought.create(req.body);
       const dbUserData = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true }
        );

        if (!dbUserData) {
            return res.status(404).json({ message: 'Thought created but No user found with this id!' });
        }

        res.status(200).json({...dbThoughtData, message: 'Thought created and user updated'});
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    } 
});


router.get('/:thoughtId', async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId });
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.status(200).json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    } 
});


router.put('/:thoughtId', async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true }
        );
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.status(200).json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});



router.delete('/:thoughtId', async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        const dbUserData = await User.findOneAndUpdate(
            {
            thoughts: req.params.thoughtId
        }, {
            $pull: {
                thoughts: req.params.thoughtId
            }
        }, {
            new: true
        });
        if (!dbUserData) {
            return res.status(404).json({ message: 'Thought deleted but No user found with this id!' });
        } res.json({ message: 'Thought deleted and user updated' });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});


router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.status(200).json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.status(200).json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


module.exports = router;