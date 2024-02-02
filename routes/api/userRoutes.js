const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../../models');
const router = require('express').Router();

// get all users
router.get('/', async (req, res) => {
  console.log("Getting all users");
  try {
    const allUsers = await User.find({})
      .populate({ path: "friends", select: '-__v' });

    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get one (1) user
router.get('/:userId', async (req, res) => {
  console.log("Getting one user");
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .populate({ path: "friends", select: '-__v' });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
});

// create a user
router.post('/', async (req, res) => {
  console.log("Creating a user");
  try {
      const newUser = await User.create(req.body)
      res.json(newUser)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

// update a user
router.put('/:userId', async (req, res) => {
  console.log("Updating a user")
  try {
    const updateUser = await User.updateOne({ _id: req.params.userId }, req.body)

    res.json(updateUser)
  } catch (err) {
    console.errer(err)
    res.status(500).json(err)
  }
})

// delete a user
router.delete('/:userId', async (req, res) => {
  console.log("Deleting a user")
  try {
    const userToDelete = await User.findOneAndDelete({ _id: req.params.userId });

    if (!userToDelete) {
      res.status(404).json({ message: "User does not exist"});
    }

    await Thought.deleteMany({ _id: { $in: userToDelete.thoughts } });
    res.json({ message: 'User successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// adding a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  console.log("Adding a friend")
  try {
    const addFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true },
    )

    if (!addFriend) {
      res.status(404).json({ message: 'Friend is no where to be seen' })
    }

    res.json('New friend!! 🎉')
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// removing a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
  console.log('Removing a friend')
  try {
    const removeFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
    )

    if (!removeFriend) {
      res.status(404).json({ message: "Friend does not exist" })
    } else {
      res.json({ message: "Friend successfully removed!" })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

module.exports = router;