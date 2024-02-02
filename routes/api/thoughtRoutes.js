const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../../models');
const router = require('express').Router();

// get all thoughts
router.get('/', async (req, res) => {
    console.log('Getting all thoughts')
    try {
        const allThoughts = await Thought.find({})
            .populate({ path: "reactions", select: "-__v" });

        res.json(allThoughts)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

// get one thought
router.get('/:thoughtId', async (req, res) => {
    console.log('Getting one thought')
    try {
        const oneThought = await Thought.findOne({ _id: req.params.thoughtId })
            .populate({ path: "reactions", select: "-__v" });

        if (!oneThought) {
            return res.status(404).json({ message: "No thoughts here" })
        }

        res.json(oneThought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

// creating a thought
router.post('/', async (req, res) => {
    console.log('Creating a thought')
    try {
        const newThought = await Thought.create(req.body)
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: newThought._id } },
            { new: true },
        );

        if (!user) {
            res.status(404).json({ message: 'Thought created, but no user thought it' })
        }

        res.json(newThought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

// router.post('/:thoughtId/reactions', async (req, res) => {
//     console.log('Creating a reaction')
//     try {
//         const createReaction = await Thought.create(req.body)
//         res.json(createReaction)
//     } catch (err) {
//         console.error(err)
//         res.status(500).json(err)
//     }
// });

module.exports = router