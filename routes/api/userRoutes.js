const { ObjectId } = require('mongoose').Types;
const { User } = require('../../models');
const router = require('express').Router();

// get all users
router.get('/', async (req, res) => {
  console.log("Getting all users");
  try {
    const allUsers = await User.find({});
    
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
    .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist'})
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  };
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
router.put('/', async (req, res) => {
  console.log("Updateing a user")
  try {
    const updateUser = await User.updateOne({ where: req.params.userId }, req.body)

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

    res.json({ message: 'User successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;