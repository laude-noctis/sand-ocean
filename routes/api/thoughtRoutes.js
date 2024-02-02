const { ObjectId } = require('mongoose').Types;
const { Thought } = require('../../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
    console.log('Getting all thoughts')
    try {
        const thought = await Thought.find({})
            .populate({ path: "reactions", select: "-__v" });

        res.json(thought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})



router.post('/:thoughtId/reactions', async (req, res) => {
    console.log('Creating a reaction')
    try {
        const createReaction = await Thought.create(req.body)
        res.json(createReaction)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

module.exports = router