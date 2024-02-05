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
        .populate('reactions', '-__v')

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

// Updating a Thought
router.put('/:thoughtId', async (req, res) => {
    console.log("Updating a thought")
    try {
        const updateThought = await Thought.updateOne({ _id: req.params.thoughtId }, req.body)

        res.json(updateThought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

// Deleting a Thought
router.delete('/:thoughtId', async (req, res) => {
    console.log("Deleting a thought")
    try {
        const byeThought = await Thought.deleteOne({ _id: req.params.thoughtId })

        if (!byeThought) {
            res.status(404).json({ message: "thought never found" });
        }

        res.json({ message: "Thought successfully forgotten!"})
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

// Creating a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
    console.log('Creating a reaction')
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });
    
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
    
        thought.reactions.push({
          reactionBody: req.body.reactionBody,
          username: req.body.username
        });
    
        await thought.save();
        res.json({ message: 'Reaction created successfully', thought });
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

// Deleteing a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    console.log("Deleting a reaction");
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!reaction) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        res.json({ message: "Reaction removed!" });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router